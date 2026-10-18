// Story 2.1: the case-study route, its metadata, robots, sitemap and the Person JSON-LD
// must come out of the static build exactly as specified (spec I/O matrix).
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
