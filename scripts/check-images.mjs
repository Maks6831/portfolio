// v3 CAP-13: image and asset rules over every built page (scripts/lib/pages.mjs). Run after `next build`.
//  - every /work/ image is served through /_next/image, with a srcset and `sizes`;
//  - at most one image preload per page: the hero on `/`, none elsewhere (the hero's arrival is staged, story 6);
//  - the preloaded LCP image weighs <= 60 kB at the mobile candidate;
//  - each page's /work/ images weigh <= 350 kB in total at the mobile candidate;
//  - zero font files (build output, public/, <link as=font>, @font-face);
//  - gzipped HTML <= 40 kB.
// Mobile candidate: Lighthouse's default mobile viewport, 412 CSS px at DPR 1.75, so the smallest srcset width that
// covers slot x 1.75. Weight is the image as Next's optimiser serves it (resize to that width, webp, the URL's q),
// encoded here with the `sharp` that next depends on. Netlify's image CDN may differ a little: like the gzip budget
// this is a proxy, not the field number.
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { builtPages } from "./lib/pages.mjs";
import { finish } from "./lib/staged.mjs";

const VIEWPORT = 412;
const DPR = 1.75;
const LCP_MAX_KB = 60;
const PAGE_IMAGES_MAX_KB = 350;
const HTML_MAX_KB = 40;
const PRELOADS_ALLOWED = { "/": 1 };
const root = fileURLToPath(new URL("..", import.meta.url));
const pages = builtPages(root);
if (!pages || !pages.some((p) => p.route === "/")) {
  console.error("check:images: .next/server/app/index.html not found; run next build first");
  process.exit(1);
}

// sharp is not a direct dependency: resolve it through next, which brings it.
let sharp;
try {
  const nextDir = realpathSync(join(root, "node_modules", "next"));
  sharp = createRequire(join(nextDir, "package.json"))("sharp");
} catch (e) {
  console.error(`check:images: cannot load sharp through next (${e.message}). Image weights cannot be measured, so this gate fails.`);
  process.exit(1);
}

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const fmt = (n) => (n / 1000).toFixed(1) + " kB";
const attrs = (tag) => {
  const out = {};
  for (const m of tag.matchAll(/\s([a-zA-Z][\w:-]*)(?:=(?:"([^"]*)"|'([^']*)'))?/g)) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? "");
  return out;
};

// `sizes` -> slot width in CSS px at the mobile viewport. Supports (min|max-width: Npx|Nem) conditions joined by
// `and`, and px / vw lengths. Anything else throws, so a new syntax cannot slip past unmeasured.
function slotWidth(sizes) {
  const cssPx = (v) => {
    const m = /^(-?[\d.]+)(px|em|rem)$/.exec(v.trim());
    if (!m) throw new Error(`unsupported media length "${v}"`);
    return m[2] === "px" ? +m[1] : +m[1] * 16;
  };
  const parts = sizes.split(",").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const m = /^((?:\([^)]*\)\s*(?:and\s*)?)*)\s*([\d.]+(?:px|vw))$/.exec(part);
    if (!m) throw new Error(`unsupported sizes entry "${part}"`);
    const [, cond, len] = m;
    let ok = true;
    for (const c of cond.matchAll(/\(\s*(min|max)-width\s*:\s*([^)]+)\)/g)) {
      const px = cssPx(c[2]);
      if (c[1] === "min" ? !(VIEWPORT >= px) : !(VIEWPORT <= px)) ok = false;
    }
    if (cond.trim() && !/^(?:\(\s*(?:min|max)-width\s*:[^)]*\)\s*(?:and\s*)?)+$/.test(cond.trim())) throw new Error(`unsupported media condition in "${part}"`);
    if (!ok) continue;
    return len.endsWith("vw") ? (parseFloat(len) / 100) * VIEWPORT : parseFloat(len);
  }
  throw new Error(`no sizes entry applies at ${VIEWPORT}px in "${sizes}"`);
}

const weights = new Map(); // "file|width|q" -> bytes
async function candidateBytes(srcset, sizes) {
  const cands = srcset.split(",").map((c) => c.trim()).filter(Boolean).map((c) => {
    const m = /^(\S+)\s+(\d+)w$/.exec(c);
    if (!m) throw new Error(`unsupported srcset entry "${c}"`);
    return { url: m[1], w: +m[2] };
  }).sort((a, b) => a.w - b.w);
  if (!cands.length) throw new Error("empty srcset");
  const need = slotWidth(sizes) * DPR;
  const pick = cands.find((c) => c.w >= need) ?? cands[cands.length - 1];
  const u = new URL(pick.url, "http://x");
  const src = u.searchParams.get("url");
  const q = +(u.searchParams.get("q") ?? 75);
  if (!src || !src.startsWith("/")) throw new Error(`cannot read the source from ${pick.url}`);
  const file = join(root, "public", decodeURIComponent(src));
  if (!existsSync(file)) throw new Error(`source image not found: public${src}`);
  const key = `${file}|${pick.w}|${q}`;
  if (!weights.has(key)) {
    const meta = await sharp(file).metadata();
    let img = sharp(file);
    if (meta.width > pick.w) img = img.resize({ width: pick.w });
    weights.set(key, (await img.webp({ quality: q }).toBuffer()).length);
  }
  return { bytes: weights.get(key), width: pick.w, src };
}

const hard = []; // blocking messages with no staged exception
const violations = []; // { key, msg }: may be staged
const notes = [];
const fail = (route, msg) => hard.push(`${route}: ${msg}`);

for (const page of pages) {
  const route = page.route;
  const html = readFileSync(page.file, "utf8");

  const htmlGz = gzipSync(html, { level: 9 }).length;
  if (htmlGz / 1000 > HTML_MAX_KB) fail(route, `gzipped HTML is ${fmt(htmlGz)}, over ${HTML_MAX_KB} kB`);

  // Image preloads.
  const preloads = [];
  for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
    const a = attrs(tag);
    if (a.rel === "preload" && a.as === "image") preloads.push(a);
    if (a.as === "font") fail(route, `font preload found: ${a.href}`);
  }
  const allowed = PRELOADS_ALLOWED[route] ?? 0;
  if (preloads.length > allowed) {
    fail(route, `${preloads.length} image preload(s), at most ${allowed} allowed${route === "/" ? " (the hero)" : ""}`);
  }
  if (route === "/" && preloads.length === 0) {
    violations.push({ key: "/|hero-preload", msg: "/: no image preload; the hero image must be preloaded (and is then the LCP image)" });
  }
  if (route === "/" && preloads.length >= 1) {
    const p = preloads[0];
    try {
      if (!p.imagesrcset || !p.imagesizes) throw new Error("the preload has no imageSrcSet/imageSizes, so the mobile candidate cannot be chosen");
      const c = await candidateBytes(p.imagesrcset, p.imagesizes);
      if (c.bytes / 1000 > LCP_MAX_KB) fail(route, `LCP image ${c.src} is ${fmt(c.bytes)} at ${c.width}w, over ${LCP_MAX_KB} kB`);
      else notes.push(`${route}: LCP image ${c.src} ${fmt(c.bytes)} at ${c.width}w`);
    } catch (e) {
      fail(route, `LCP image weight: ${e.message}`);
    }
  }

  // /work/ images.
  let total = 0;
  let count = 0;
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    const a = attrs(tag);
    const hay = `${a.src ?? ""} ${a.srcset ?? ""}`;
    if (!/(?:^|[\s"'(])\/work\/|%2Fwork%2F/.test(hay)) continue;
    count++;
    const label = (a.src ?? "").slice(0, 80);
    if (!(a.src ?? "").startsWith("/_next/image?")) {
      fail(route, `/work/ image not served through /_next/image: ${label}`);
      continue;
    }
    if (!a.srcset) { fail(route, `/work/ image has no srcset: ${label}`); continue; }
    if (!a.sizes) { fail(route, `/work/ image has no sizes: ${label}`); continue; }
    try {
      total += (await candidateBytes(a.srcset, a.sizes)).bytes;
    } catch (e) {
      fail(route, `image weight for ${label}: ${e.message}`);
    }
  }
  if (route === "/work/simply-happy" && count === 0) fail(route, "no /work/ image found on the case study, so the image rules would pass vacuously");
  if (total / 1000 > PAGE_IMAGES_MAX_KB) fail(route, `/work/ images total ${fmt(total)} at the mobile candidate, over ${PAGE_IMAGES_MAX_KB} kB`);
  if (count) notes.push(`${route}: ${count} /work/ images, ${fmt(total)} at the mobile candidate; gzipped HTML ${fmt(htmlGz)}`);
  else notes.push(`${route}: no /work/ images; gzipped HTML ${fmt(htmlGz)}`);
}

// Font files and @font-face.
const fontExt = new Set([".woff", ".woff2", ".ttf", ".otf", ".eot"]);
const walk = (dir, fn) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, fn);
    else fn(full, e.name);
  }
};
for (const base of [join(root, ".next", "static"), join(root, "public")]) {
  walk(base, (full, name) => {
    const rel = full.slice(root.length);
    if (fontExt.has(extname(name).toLowerCase())) hard.push(`font file in the build: ${rel}`);
    else if (name.endsWith(".css") && /@font-face/.test(readFileSync(full, "utf8"))) hard.push(`@font-face in ${rel}`);
  });
}
for (const page of pages) {
  if (/@font-face/.test(readFileSync(page.file, "utf8"))) hard.push(`${page.route}: @font-face in the page HTML`);
}

finish(
  "images",
  [...violations, ...hard.map((msg) => ({ key: `hard|${msg}`, msg }))],
  `check:images ok: ${pages.length} pages\n` + notes.map((n) => "  " + n).join("\n"),
);
