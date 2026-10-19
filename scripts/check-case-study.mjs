// Story 2.1: the case-study route, its metadata, robots, sitemap and the Person JSON-LD
// must come out of the static build exactly as specified (spec I/O matrix).
// Story 2.6: the Screenshots section, its "Test data" captions, the files behind it and the island set.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const app = join(root, ".next", "server", "app");

if (!existsSync(app)) {
  console.error("check:case-study: .next not found; run next build first");
  process.exit(1);
}

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const attr = (html, re) => { const m = re.exec(html); return m ? decode(m[1]) : null; };

// Known slug is prerendered; no other slug is, and unknown slugs 404 at the routing layer.
const workDir = join(app, "work");
const htmls = existsSync(workDir) ? readdirSync(workDir).filter((f) => f.endsWith(".html")) : [];
check(htmls.length === 1 && htmls[0] === "simply-happy.html", `work/ should hold only simply-happy.html, found: ${htmls.join(", ") || "none"}`);
try {
  const manifest = JSON.parse(read(join(root, ".next", "prerender-manifest.json")) ?? "{}");
  check(manifest.dynamicRoutes?.["/work/[slug]"]?.fallback === false, "prerender-manifest: /work/[slug] must have fallback === false (dynamicParams = false)");
} catch { failures.push("prerender-manifest.json does not parse"); }

// Page structure
const html = read(join(workDir, "simply-happy.html")) ?? "";
const h1s = html.match(/<h1\b/g) ?? [];
check(h1s.length === 1, "case study must have exactly one <h1>");
const firstH1 = html.search(/<h1\b/);
const firstH2 = html.search(/<h2\b/);
check(firstH1 !== -1 && firstH2 > firstH1, "the first <h2> must come after the single <h1>");
// 2 summary panels (Before, After) + 6 "What I owned" areas; these numbers track src/content/work/simply-happy.ts.
check((html.match(/<h3\b/g) ?? []).length === 8, "expected exactly 8 <h3> panels (2 summary + 6 owned)");
check(html.includes('id="summary"'), 'missing <section id="summary">');
check(html.includes('id="owned"'), 'missing <section id="owned">');
check(html.includes('<main id="main"'), "root layout <main id=\"main\"> must wrap the page");
check(html.includes('id="contact"'), "contact footer (#contact) must be on the page for the nav link");

const stackList = /<ul\b[^>]*aria-label="Technologies used"[^>]*>([\s\S]*?)<\/ul>/.exec(html)?.[1] ?? "";
check((stackList.match(/<li\b/g) ?? []).length === 6, "stack list should hold 6 chips");

const summaryStart = html.indexOf('id="summary"');
const ownedStart = html.indexOf('id="owned"');
const summary = summaryStart !== -1 && ownedStart > summaryStart ? html.slice(summaryStart, ownedStart) : "";
const live = /<a\b[^>]*target="_blank"[^>]*>([\s\S]*?)<\/a>/.exec(summary);
check(!!live, "summary must contain the live-site link opening in a new tab");
if (live) {
  check(/rel="noopener noreferrer"/.test(live[0]), 'live-site link needs rel="noopener noreferrer"');
  check(live[1].includes("(opens in a new tab)"), 'live-site link needs the "(opens in a new tab)" hint');
}

// Heading order: h1, Summary, What I owned, Screenshots, then the contact footer. Later stories insert
// sections between and update this list.
const h2s = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
const expectedH2s = ["Summary", "What I owned", "Screenshots (test data)"];
check(
  h2s.length === expectedH2s.length + 1 && expectedH2s.every((t, i) => h2s[i] === t),
  `h2 order should be ${expectedH2s.join(" > ")} > contact, found: ${h2s.join(" > ") || "none"}`,
);

// Screenshots (Story 2.6). The expected count follows the content module, so the gate tracks the manifest;
// one explicit check pins what the manifest lists today.
const contentSrc = read(join(root, "src", "content", "work", "simply-happy.ts")) ?? "";
const shotEntries = [...contentSrc.matchAll(/\bsrc:\s*"(\/work\/simply-happy\/[^"]+)"([\s\S]*?)\}/g)].map((m) => ({
  src: m[1],
  width: Number(/\bwidth:\s*(\d+)/.exec(m[2])?.[1]),
  height: Number(/\bheight:\s*(\d+)/.exec(m[2])?.[1]),
}));
const srcs = shotEntries.map((e) => e.src);
check(new Set(srcs).size === srcs.length, "content module references the same screenshot twice");
const expectedShots = new Set(srcs).size;
check(expectedShots > 0, "content module references no screenshots under /work/simply-happy/");
check(expectedShots === 7, `manifest currently lists 7 screenshots; content module references ${expectedShots}`);

// Every referenced file exists under public/ and the declared intrinsic size matches the PNG header (IHDR).
const pngSize = (file) => {
  const b = readFileSync(file);
  return b.length >= 24 && b.toString("latin1", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null;
};
for (const { src, width, height } of shotEntries) {
  const file = join(root, "public", src);
  check(existsSync(file), `screenshot missing on disk: public${src}`);
  if (!existsSync(file)) continue;
  const size = pngSize(file);
  check(
    !!size && size[0] === width && size[1] === height,
    `content width/height for ${src} is ${width}x${height} but the PNG is ${size ? size.join("x") : "not a PNG"}`,
  );
}

check(html.includes('id="screenshots"'), 'missing <section id="screenshots">');
const shotsStart = html.indexOf('id="screenshots"');
const contactStart = html.indexOf('id="contact"');
const shots = shotsStart !== -1 && contactStart > shotsStart ? html.slice(shotsStart, contactStart) : "";
check(ownedStart !== -1 && shotsStart > ownedStart, "#screenshots must come after #owned");
const figures = html.match(/<figure\b/g) ?? [];
check(figures.length === expectedShots, `expected exactly ${expectedShots} <figure> on the case study, found ${figures.length}`);
check((shots.match(/<figure\b/g) ?? []).length === expectedShots, `all ${expectedShots} figures must sit inside #screenshots`);
check(!/<h3\b/.test(shots), "no <h3> inside #screenshots unless a figure heading is added deliberately");
const captions = [...html.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
check(captions.length === expectedShots, `expected ${expectedShots} <figcaption>, found ${captions.length}`);
for (const c of captions) check(c.startsWith("Test data"), `figcaption must start with "Test data": ${c}`);
const thumbs = shots.match(/<button\b[^>]*aria-haspopup="dialog"/g) ?? [];
check(thumbs.length === expectedShots, `expected ${expectedShots} thumbnail buttons with aria-haspopup="dialog", found ${thumbs.length}`);
const dialogs = shots.match(/<dialog\b[^>]*>/g) ?? [];
check(
  dialogs.length === expectedShots && dialogs.every((d) => /\saria-label="Larger view: Test data/.test(d)),
  `expected ${expectedShots} <dialog> in #screenshots, each with aria-label starting "Larger view: Test data", found ${dialogs.length}`,
);
// The same <img> requirements apply to every ScreenshotFrame image, on this page and on the home feature.
const checkFrameImg = (img, where) => {
  check(/\salt="[^"]+"/.test(img), `${where} <img> needs non-empty alt: ${img.slice(0, 120)}`);
  check(/\sloading="lazy"/.test(img) && !/fetchpriority="high"/i.test(img), `${where} <img> must be lazy, none is the LCP: ${img.slice(0, 120)}`);
  check(/\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img) && /\ssizes="/.test(img), `${where} <img> needs width, height and sizes: ${img.slice(0, 120)}`);
};
const shotImgs = shots.match(/<img\b[^>]*>/g) ?? [];
check(shotImgs.length === expectedShots, `expected ${expectedShots} <img> in #screenshots (dialog bodies mount only when open), found ${shotImgs.length}`);
for (const img of shotImgs) checkFrameImg(img, "screenshot");
// Next encodes the path in preload hrefs and imageSrcSet (%2Fwork%2Fsimply-happy%2F), so match both spellings.
const shotPath = /(?:\/|%2F)work(?:\/|%2F)simply-happy(?:\/|%2F)/i;
for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
  if (/\srel="preload"/.test(tag) && /\sas="image"/.test(tag)) check(!shotPath.test(tag), `no screenshot may be preloaded: ${tag.slice(0, 160)}`);
}

// Home page: the ScreenshotFrame default image branch must still render inside the Simply Happy feature.
const home = read(join(app, "index.html")) ?? "";
const workStart = home.indexOf('id="work"');
const workEnd = workStart === -1 ? -1 : home.indexOf("<section", workStart + 1);
const homeWork = workStart === -1 ? "" : home.slice(workStart, workEnd === -1 ? undefined : workEnd);
check((homeWork.match(/<figure\b/g) ?? []).length === 1, "home #work must hold exactly one <figure>");
check((homeWork.match(/<figcaption\b/g) ?? []).length === 1, "home #work must hold exactly one <figcaption>");
const homeImgs = homeWork.match(/<img\b[^>]*>/g) ?? [];
check(homeImgs.length === 1, `home #work must hold exactly one <img>, found ${homeImgs.length}`);
for (const img of homeImgs) checkFrameImg(img, "home feature");

// Exactly the expected islands (source files only); "use client" placement itself is enforced by check-islands.
const islandsDir = join(root, "src", "components", "islands");
const islands = existsSync(islandsDir)
  ? readdirSync(islandsDir, { withFileTypes: true }).filter((e) => e.isFile() && /\.[jt]sx?$/.test(e.name)).map((e) => e.name).sort()
  : [];
const expectedIslands = ["CopyEmail.tsx", "FloatingNavbar.tsx", "ScreenshotViewer.tsx"];
check(JSON.stringify(islands) === JSON.stringify(expectedIslands), `src/components/islands should hold exactly ${expectedIslands.join(", ")}; found: ${islands.join(", ") || "none"}`);

// Metadata
const title = attr(html, /<title>([^<]*)<\/title>/);
check(title === "Simply Happy case study · Muhammad Ali Khan", `case study <title> mismatch: ${title}`);
check(attr(html, /<meta property="og:title" content="([^"]*)"/) === title, "og:title must equal the page title");
check(attr(html, /<link rel="canonical" href="([^"]*)"/) === "https://muhammadalikhan.co.uk/work/simply-happy", "canonical should be the absolute /work/simply-happy URL");
check(attr(html, /<meta property="og:url" content="([^"]*)"/) === "https://muhammadalikhan.co.uk/work/simply-happy", "og:url mismatch");
check(/property="og:image"/.test(html), "case study must carry the social image");
check(/name="twitter:image"/.test(html), "case study must carry the twitter image");
const description = attr(html, /<meta name="description" content="([^"]*)"/);
const lede = attr(html, /<h1\b[^>]*>[\s\S]*?<\/h1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/);
check(!!description && description === lede, `meta description must equal the lede\n    description: ${description}\n    lede: ${lede}`);

// Tokens only: no raw hex colours in the new source files.
const hex = /#[0-9a-f]{3,8}\b/i;
const sourceFiles = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.[jt]sx?$/.test(entry.name)) sourceFiles.push(full);
  }
};
walk(join(root, "src", "app", "work"));
walk(join(root, "src", "content", "work"));
sourceFiles.push(join(root, "src", "components", "ui", "CaseStudyPanel.tsx"));
sourceFiles.push(join(root, "src", "components", "ui", "ScreenshotFrame.tsx"));
sourceFiles.push(join(root, "src", "components", "islands", "ScreenshotViewer.tsx"));
for (const file of sourceFiles) {
  const src = read(file);
  check(src !== null, `missing source file ${relative(root, file)}`);
  if (src !== null) check(!hex.test(src), `raw hex colour in ${relative(root, file)}; use tailwind.config.ts tokens`);
}

// robots and sitemap
const robots = read(join(app, "robots.txt.body")) ?? "";
check(/User-Agent: \*/i.test(robots) && /Allow: \//.test(robots), "robots.txt must allow all");
check(robots.includes("Sitemap: https://muhammadalikhan.co.uk/sitemap.xml"), "robots.txt must point at the sitemap");
const sitemap = read(join(app, "sitemap.xml.body")) ?? "";
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length === 2 && locs.includes("https://muhammadalikhan.co.uk") && locs.includes("https://muhammadalikhan.co.uk/work/simply-happy"), `sitemap should list home and the case study, found: ${locs.join(", ") || "none"}`);
// A date-only lastmod proves the value came from content; `new Date()` would serialise with a time part.
check((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length === 2, "sitemap entries need a fixed date-only lastmod");

// Person JSON-LD, once per page
const sameAs = ["https://www.linkedin.com/in/muhammad-khan-464b80203/", "https://github.com/Maks6831"];
for (const [name, file] of [["home", join(app, "index.html")], ["case study", join(workDir, "simply-happy.html")]]) {
  const doc = read(file) ?? "";
  const scripts = doc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
  check(scripts.length === 1, `${name}: expected exactly one JSON-LD script, found ${scripts.length}`);
  if (scripts.length === 1) {
    try {
      const data = JSON.parse(scripts[0].replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""));
      check(data["@type"] === "Person" && data.name && data.jobTitle, `${name}: Person JSON-LD is missing name or jobTitle`);
      check(data.url === "https://muhammadalikhan.co.uk", `${name}: Person url mismatch`);
      check(JSON.stringify(data.sameAs) === JSON.stringify(sameAs), `${name}: Person sameAs must be exactly LinkedIn then GitHub`);
      check(data.address?.addressLocality === "London" && data.address?.addressCountry === "GB", `${name}: Person address must be London, GB`);
    } catch { failures.push(`${name}: JSON-LD does not parse`); }
  }
}

if (failures.length) {
  console.error("check:case-study FAILED:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("check:case-study passed");
