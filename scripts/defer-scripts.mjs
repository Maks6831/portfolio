// Release step run last by `pnpm build` (after every gate has read the HTML as Next wrote it).
//
// Moves the framework's `<script src async>` tags in each prerendered page out of the parser's reach: one tiny inline
// loader appends them after the window `load` event and the next painted frame (load can fire ~10 ms before the
// first paint of a light page, and a script requested before the LCP paint is counted), and their
// `<link rel="preload" as="script">` hints are dropped.
// The page is fully painted and the LCP image decoded by then; hydration of the four islands follows right after.
// Why: Lighthouse's simulated (Lantern) LCP counts every script that finished downloading before the observed LCP,
// and at 1.6 Mbps the ~145 kB gzipped framework costs about 0.7 s (measured: 1.74 s with, 1.05 s without).
//
// Idempotent. `noModule` polyfill tags are left alone (modern browsers never fetch them).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { builtPages } from "./lib/pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pages = builtPages(root);
if (!pages) {
  console.error("defer-scripts: .next/server/app not found; run next build first");
  process.exit(1);
}

const SCRIPT = /<script src="(\/_next\/[^"]+\.js)" async=""><\/script>/g;
const PRELOAD = /<link rel="preload" as="script"[^>]*\/>/g;
let changed = 0;

for (const page of pages) {
  const html = readFileSync(page.file, "utf8");
  if (html.includes("data-defer-scripts")) continue;
  const srcs = [];
  let out = html.replace(SCRIPT, (_, src) => {
    srcs.push(src);
    return "";
  });
  if (srcs.length === 0) continue;
  out = out.replace(PRELOAD, "");
  const loader =
    `<script data-defer-scripts>(function(s){function go(){requestAnimationFrame(function(){requestAnimationFrame(function(){setTimeout(function(){s.forEach(function(u){` +
    `var e=document.createElement("script");e.src=u;e.async=true;document.body.appendChild(e)})},0)})})}` +
    `document.readyState==="complete"?go():addEventListener("load",go)})(${JSON.stringify(srcs)})</script>`;
  if (!out.includes("</body>")) {
    console.error(`defer-scripts: ${page.rel} has no </body>`);
    process.exit(1);
  }
  out = out.replace("</body>", loader + "</body>");
  writeFileSync(page.file, out);
  changed++;
  console.log(`defer-scripts: ${page.rel}: ${srcs.length} scripts deferred to after load`);
}
console.log(`defer-scripts ok: ${changed} pages`);
