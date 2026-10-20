// AD-7: every built page's first-load JavaScript (modern browsers) must stay at or below 175 kB gzipped.
// For each prerendered page (scripts/lib/pages.mjs), counts the <script src> chunks in its HTML, gzip level 9,
// 1 kB = 1000 bytes. This is a conservative proxy: Netlify serves brotli, which is smaller. `noModule` polyfills
// are skipped because modern browsers never download them. One ceiling for every page, one line per page.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { builtPages } from "./lib/pages.mjs";

const LIMIT_KB = 175;
const root = fileURLToPath(new URL("..", import.meta.url));
const pages = builtPages(root);

if (!pages) {
  console.error("check:budget: .next/server/app not found; run next build first");
  process.exit(1);
}
if (!pages.some((p) => p.route === "/")) {
  console.error("check:budget: .next/server/app/index.html not found; run next build first");
  process.exit(1);
}

const fmt = (n) => (n / 1000).toFixed(1) + " kB";
const errors = [];
const results = [];
const sizes = new Map(); // gzip size per chunk, shared across pages

for (const page of pages) {
  const html = readFileSync(page.file, "utf8");
  const srcs = new Set();
  for (const tag of html.match(/<script\b[^>]*>/g) ?? []) {
    if (/\snomodule\b/i.test(tag)) continue;
    const m = /\ssrc=(?:"([^"]+)"|'([^']+)')/.exec(tag);
    const src = m ? (m[1] ?? m[2]) : "";
    if (src.startsWith("/_next/static/")) srcs.add(src.split("?")[0]);
  }
  if (!srcs.size) {
    errors.push(`${page.route}: no /_next/static scripts found in ${page.rel}`);
    continue;
  }

  const chunks = [];
  for (const src of srcs) {
    const file = join(root, ".next", src.replace("/_next/", ""));
    if (!existsSync(file)) {
      errors.push(`${page.route}: referenced script missing on disk: ${src}`);
      continue;
    }
    if (!sizes.has(src)) sizes.set(src, gzipSync(readFileSync(file), { level: 9 }).length);
    chunks.push({ src, bytes: sizes.get(src) });
  }
  const total = chunks.reduce((n, c) => n + c.bytes, 0);
  const top = [...chunks].sort((a, b) => b.bytes - a.bytes).slice(0, 3);
  results.push({ page, total, count: chunks.length, top });
}

if (errors.length) {
  console.error("check:budget FAILED:");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

const over = results.filter((r) => r.total / 1000 > LIMIT_KB);
if (over.length) {
  console.error(`check:budget FAILED: first-load JS over the ${LIMIT_KB} kB ceiling`);
  for (const r of over) {
    console.error(`  ${r.page.route}: ${fmt(r.total)} gzipped across ${r.count} scripts. Largest chunks:`);
    for (const c of r.top) console.error(`    ${fmt(c.bytes)}  ${c.src}`);
  }
  process.exit(1);
}

console.log(`check:budget ok: ${results.length} pages at or under the ${LIMIT_KB} kB ceiling (first-load JS, gzipped)`);
for (const r of results) {
  console.log(`  ${r.page.route}: ${fmt(r.total)} across ${r.count} scripts`);
  console.log("    largest: " + r.top.map((c) => `${fmt(c.bytes)} ${c.src.split("/").pop()}`).join(", "));
}
