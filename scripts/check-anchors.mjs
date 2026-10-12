// AD-7: every in-page #anchor must resolve to an element id.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const htmlPath = join(root, ".next", "server", "app", "index.html");

if (!existsSync(htmlPath)) {
  console.error(`check:anchors: ${htmlPath} not found; run next build first`);
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const ids = new Set();
for (const m of html.matchAll(/\sid=(?:"([^"]*)"|'([^']*)')/g)) ids.add(m[1] ?? m[2]);

const dead = new Set();
let count = 0;
for (const m of html.matchAll(/<a\b[^>]*?\shref=(?:"([^"]*)"|'([^']*)')/g)) {
  const raw = m[1] ?? m[2];
  const href = raw.replace(/^\/(?=#)/, ""); // "/#x" on the home page is an in-page link too
  if (!href.startsWith("#") || href === "#" || href === "#top") continue; // "#top" is valid per HTML
  count++;
  let id = href.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {}
  if (!ids.has(id)) dead.add(href);
}

if (dead.size) {
  console.error("check:anchors FAILED: in-page links with no matching id:");
  for (const h of dead) console.error("  " + h);
  process.exit(1);
}
if (count === 0) {
  console.error("check:anchors FAILED: found no in-page anchors, so the check would pass vacuously");
  process.exit(1);
}
console.log(`check:anchors ok: ${count} in-page anchors all resolve`);
