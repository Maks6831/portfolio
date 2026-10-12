// AD-7: home first-load JavaScript (modern browsers) must stay at or below 175 kB gzipped.
// Counts the <script src> chunks in the built home page, gzip level 9, 1 kB = 1000 bytes. This is a
// conservative proxy: Netlify serves brotli, which is smaller. `noModule` polyfills are skipped because
// modern browsers never download them.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const LIMIT_KB = 175;
const root = fileURLToPath(new URL("..", import.meta.url));
const htmlPath = join(root, ".next", "server", "app", "index.html");

if (!existsSync(htmlPath)) {
  console.error(`check:budget: ${htmlPath} not found; run next build first`);
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const srcs = new Set();
for (const tag of html.match(/<script\b[^>]*>/g) ?? []) {
  if (/\snomodule\b/i.test(tag)) continue;
  const m = /\ssrc=(?:"([^"]+)"|'([^']+)')/.exec(tag);
  const src = m ? (m[1] ?? m[2]) : "";
  if (src.startsWith("/_next/static/")) srcs.add(src.split("?")[0]);
}
if (!srcs.size) {
  console.error("check:budget: no /_next/static scripts found in index.html");
  process.exit(1);
}

const chunks = [];
for (const src of srcs) {
  const file = join(root, ".next", src.replace("/_next/", ""));
  if (!existsSync(file)) {
    console.error(`check:budget: referenced script missing on disk: ${src}`);
    process.exit(1);
  }
  chunks.push({ src, bytes: gzipSync(readFileSync(file), { level: 9 }).length });
}

const total = chunks.reduce((n, c) => n + c.bytes, 0);
const kb = total / 1000;
const top = [...chunks].sort((a, b) => b.bytes - a.bytes).slice(0, 3);
const fmt = (n) => (n / 1000).toFixed(1) + " kB";

if (kb > LIMIT_KB) {
  console.error(
    `check:budget FAILED: home first-load JS is ${fmt(total)} gzipped, over the ${LIMIT_KB} kB ceiling`,
  );
  console.error("Largest chunks:");
  for (const c of top) console.error(`  ${fmt(c.bytes)}  ${c.src}`);
  process.exit(1);
}
console.log(
  `check:budget ok: home first-load JS ${fmt(total)} gzipped across ${chunks.length} scripts (ceiling ${LIMIT_KB} kB)`,
);
console.log("  largest: " + top.map((c) => `${fmt(c.bytes)} ${c.src.split("/").pop()}`).join(", "));
