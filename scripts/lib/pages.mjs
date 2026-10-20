// Shared by check-budget and check-anchors: every prerendered App Router page under .next/server/app, with a label.
// `index.html` is "/", `work/simply-happy.html` is "/work/simply-happy", and `_not-found.html` is "/_not-found" (the
// static 404 page; `routable: false`, since no URL serves it by that path, so links can never resolve to it).
// `_global-error.html` is left out: it is Next's own error boundary, not a page a link can reach, and it has no links.
import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const builtPages = (root) => {
  const app = join(root, ".next", "server", "app");
  if (!existsSync(app)) return null;
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) {
        const rel = relative(app, full).split(sep).join("/");
        if (rel === "_global-error.html") continue;
        const route = "/" + rel.replace(/\.html$/, "").replace(/(?:^|\/)index$/, "");
        pages.push({ file: full, rel, route, routable: !route.split("/").some((part) => part.startsWith("_")) });
      }
    }
  };
  walk(app);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
};
