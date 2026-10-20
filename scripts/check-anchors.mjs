// AD-7: every internal link on every built page must resolve. "#x" resolves against the page's own ids; "/#x" and
// "/route#x" against that built page's ids (scripts/lib/pages.mjs maps files to routes). An internal path with no
// fragment must be a built page or a file under public/. External and mailto: links are skipped. Only links whose
// target id was actually found count: every page needs at least one, and the site at least one cross-page fragment
// link, so the check never passes vacuously.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { builtPages } from "./lib/pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pages = builtPages(root);

if (!pages || !pages.some((p) => p.route === "/")) {
  console.error("check:anchors: .next/server/app/index.html not found; run next build first");
  process.exit(1);
}

// &amp; last, so "&amp;lt;" stays the literal text "&lt;".
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const decodeUri = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
// Markup only: the RSC payload and JSON-LD inside <script> are not elements and cannot be link targets.
const html = new Map(pages.map((p) => [p.route, readFileSync(p.file, "utf8").replace(/<script\b[\s\S]*?<\/script>/g, "")]));
const ids = new Map();
for (const [route, doc] of html) {
  const set = new Set();
  for (const m of doc.matchAll(/\sid=(?:"([^"]*)"|'([^']*)')/g)) set.add(decode(m[1] ?? m[2]));
  ids.set(route, set);
}
const routable = new Set(pages.filter((p) => p.routable).map((p) => p.route));
const normalise = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
const publicFile = (path) => {
  const file = join(root, "public", decodeUri(path));
  return path !== "/" && existsSync(file) && statSync(file).isFile();
};

const dead = [];
const verified = new Map();
let crossPage = 0;
for (const [route, doc] of html) {
  let count = 0;
  for (const m of doc.matchAll(/<a\b[^>]*?\shref=(?:"([^"]*)"|'([^']*)')/g)) {
    const href = decode(m[1] ?? m[2]);
    const hash = href.indexOf("#");
    const path = hash === -1 ? href : href.slice(0, hash);
    const internal = path.startsWith("/") && !path.startsWith("//");
    if (path !== "" && !internal) continue; // external, mailto:, "//host"
    const target = path === "" ? route : normalise(path.split("?")[0]);
    if (path !== "" && !routable.has(target)) {
      if (!publicFile(target)) dead.push(`${route}: ${href} (no built page or public file for ${target})`);
      continue; // a static file: nothing to verify beyond its existence
    }
    if (hash === -1) continue; // a built page, no fragment
    const id = decodeUri(href.slice(hash + 1));
    if (id === "" || id === "top") continue; // "#" and "#top" scroll to the top of the target page per HTML
    if (!ids.get(target).has(id)) {
      dead.push(`${route}: ${href} (no id "${id}" on ${target})`);
      continue;
    }
    count++;
    if (target !== route) crossPage++;
  }
  verified.set(route, count);
}

const empty = [...verified].filter(([, n]) => n === 0).map(([route]) => route);
if (dead.length || empty.length || crossPage === 0) {
  console.error("check:anchors FAILED:");
  for (const d of dead) console.error("  dead link on " + d);
  for (const route of empty) console.error(`  ${route}: no fragment link with a verified target, so the check would pass vacuously`);
  if (crossPage === 0) console.error("  no cross-page fragment link (/#x or /route#x) was verified anywhere on the site");
  process.exit(1);
}
const total = [...verified.values()].reduce((a, b) => a + b, 0);
console.log(
  `check:anchors ok: ${total} fragment links verified across ${verified.size} pages, ${crossPage} of them cross-page (` +
    [...verified].map(([route, n]) => `${route} ${n}`).join(", ") +
    "); every internal path is a built page or a public file",
);
