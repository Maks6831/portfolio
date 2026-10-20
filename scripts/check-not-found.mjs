// Story 2.8: the static not-found page. Checks the prerendered .next/server/app/_not-found.html and its source.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const htmlPath = join(root, ".next", "server", "app", "_not-found.html");
const srcPath = join(root, "src", "app", "not-found.tsx");

if (!existsSync(htmlPath)) {
  console.error("check:not-found: .next/server/app/_not-found.html not found; run next build first");
  process.exit(1);
}

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const html = readFileSync(htmlPath, "utf8");
const readOpt = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const app = join(root, ".next", "server", "app");
const src = existsSync(srcPath) ? readFileSync(srcPath, "utf8") : "";
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = decode(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " "));

check(src !== "", "src/app/not-found.tsx is missing");
let status;
try { status = JSON.parse(readOpt(join(app, "_not-found.meta"))).status; } catch { status = undefined; }
const siteName = /<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"/.exec(decode(readOpt(join(app, "index.html"))))?.[1];
const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);

check(status === 404, `_not-found.meta status should be 404, found ${status}`);
check((html.match(/<h1[\s>]/g) ?? []).length === 1, "expected exactly one <h1>");
check(/<a[^>]*\shref="\/"/.test(html), 'missing link to "/"');
check(/<a[^>]*\shref="\/work\/simply-happy"/.test(html), 'missing link to "/work/simply-happy"');
check(/<meta[^>]*name="robots"[^>]*content="noindex/.test(html), "missing noindex robots meta");
check(!/<link[^>]*rel="canonical"/.test(html), 'built HTML must not carry <link rel="canonical">');
check(!!siteName, "could not read og:site_name from .next/server/app/index.html");
check(!!siteName && decode(html).includes(`<title>Page not found · ${siteName}</title>`), `title should be "Page not found · ${siteName}"`);
check(/<main id="main"[\s\S]*<h1[\s>][\s\S]*<\/main>/.test(html), 'page content should sit inside <main id="main"');
check(!imports.some((i) => i.startsWith("@/components/islands")), "not-found.tsx must not import from @/components/islands");
check(!/#[0-9a-fA-F]{3,8}\b/.test(src), "raw hex colour in not-found.tsx");
check(!/\b(rgb|rgba|hsl|hsla)\(/i.test(src), "rgb()/hsl() colour in not-found.tsx");
check(!text.includes("!"), "exclamation mark in page text");
check(!/oops|uh-oh|whoops/i.test(text), "banned interjection in page text");

if (failures.length) {
  console.error("check:not-found FAILED:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("check:not-found passed");
