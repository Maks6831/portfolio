// Story 2.7: render TocHighlight directly (no browser, no test framework) and check the spec's I/O matrix rows that
// hold in the static HTML: plain in-page links of the agreed shape, 44px targets with the ScreenshotViewer focus ring,
// a closed disclosure for small screens beside a sticky column for lg, nothing marked current before JavaScript runs,
// no positive tabindex, and the reduced-motion rule in globals.css that makes anchor jumps instant. The "Scroll" row
// runs through the island's pure pick rule and ContentsList rendered with a current section.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compileComponents, renderTools, root } from "./lib/render-component.mjs";

// The island may import only React, asserted from its source below: anything else, a `@/` helper such as `cn` as much
// as a package such as react-icons or clsx, can land in a chunk the home page also loads and grow its first-load JS.
// No `@/` alias is mapped for the same reason.
const { load } = compileComponents({
  cacheName: "check-toc",
  aliases: {},
  files: {
    "src/components/islands/TocHighlight.tsx": "TocHighlight.js",
  },
});
const TocHighlight = await load("TocHighlight.js");
const ContentsList = await load("TocHighlight.js", "ContentsList");
const pickCurrent = await load("TocHighlight.js", "pickCurrent");
const { h, render, count, failures, check } = await renderTools();

const items = [
  { id: "first", label: "First section" },
  { id: "second", label: "Second & more" },
  { id: "third", label: "Third section" },
];
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const classes = (tag) => new Set((/\sclass="([^"]*)"/.exec(tag)?.[1] ?? "").split(/\s+/).filter(Boolean));
const hasAll = (set, tokens) => tokens.every((t) => set.has(t));

// The focus ring is ScreenshotViewer's, read from its source so the two cannot drift apart.
const viewerSrc = readFileSync(join(root, "src", "components", "islands", "ScreenshotViewer.tsx"), "utf8");
const focusRing = (/const focusRing =\s*"([^"]+)"/.exec(viewerSrc)?.[1] ?? "").split(/\s+/).filter(Boolean);
check(focusRing.length > 0 && focusRing.includes("focus-visible:outline-focus-ring"), "setup: could not read the focus ring from ScreenshotViewer.tsx");

// No sections, nothing to list.
check(render(h(TocHighlight, { items: [] })) === "", "island: must render nothing when there are no items");

const html = render(h(TocHighlight, { items }));
check(/^<div\b/.test(html) && html.endsWith("</div>"), "island: the root is one <div> (one grid item beside the sections)");

// Matrix "Desktop" and "Below lg": two navs named "Contents", one sticky column shown from lg, one disclosure below it.
const navs = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/g) ?? [];
check(navs.length === 2, `island: expected two <nav> (disclosure and column), found ${navs.length}`);
check(navs.every((nav) => /^<nav\b[^>]*\saria-label="Contents"/.test(nav)), 'island: both navs must be named aria-label="Contents"');
const navClasses = (nav) => classes(/^<nav\b[^>]*>/.exec(nav)?.[0] ?? "");
const column = navs.find((nav) => hasAll(navClasses(nav), ["hidden", "lg:block", "lg:sticky"])) ?? "";
const disclosure = navs.find((nav) => navClasses(nav).has("lg:hidden") && !navClasses(nav).has("hidden")) ?? "";
check(!!column, 'column: one nav must be "hidden lg:block lg:sticky"');
check(!!disclosure, 'disclosure: one nav must be "lg:hidden"');
check(!column || [...navClasses(column)].some((c) => /^lg:top-/.test(c)), "column: the sticky nav needs an lg:top- offset clear of the floating nav");
check(html.indexOf(disclosure) < html.indexOf(column), "island: the disclosure comes first, so below lg it sits directly above the first section");

// The disclosure: one closed <details> (native, so it opens and closes without JavaScript), its <summary> first and
// reading "Contents", in the case-study tile surface.
const detailsTags = disclosure.match(/<details\b[^>]*>/g) ?? [];
check(detailsTags.length === 1, `disclosure: exactly one <details>, found ${detailsTags.length}`);
const detailsTag = detailsTags[0] ?? "";
check(!/\sopen(?=[\s=>])/.test(detailsTag), "disclosure: the <details> must be closed in the HTML (no open attribute)");
check(hasAll(classes(detailsTag), ["rounded-card", "border", "border-border", "bg-surface"]), "disclosure: the <details> is a tile (rounded-card border border-border bg-surface)");
check(/<details\b[^>]*>\s*<summary\b/.test(disclosure), "disclosure: <summary> must be the first child of <details>");
const summaryTag = /<summary\b[^>]*>/.exec(disclosure)?.[0] ?? "";
const summaryText = text(/<summary\b[^>]*>([\s\S]*?)<\/summary>/.exec(disclosure)?.[1] ?? "");
check(summaryText === "Contents", `disclosure: <summary> must read "Contents", found "${summaryText}"`);
check(classes(summaryTag).has("min-h-11"), "disclosure: <summary> needs a 44px target (min-h-11)");
check(hasAll(classes(summaryTag), focusRing), "disclosure: <summary> needs the ScreenshotViewer focus ring");
const olAt = disclosure.indexOf("<ol");
const summaryEnd = disclosure.indexOf("</summary>");
const detailsEnd = disclosure.indexOf("</details>");
check(olAt !== -1 && summaryEnd !== -1 && olAt > summaryEnd && olAt < detailsEnd, "disclosure: the list sits inside <details>, after <summary>");

// The column: scrolls on its own when taller than a short window, with room for the focus ring; an eyebrow <p>, not a
// heading, then the list.
check(hasAll(navClasses(column), ["lg:max-h-[calc(100vh-7rem)]", "lg:overflow-y-auto", "lg:p-1"]), "column: the sticky nav must scroll within the window below its offset (lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto) with lg:p-1 so the focus ring is not clipped");
check(/<p\b[^>]*>\s*On this page\s*<\/p>/.test(column), 'column: needs the "On this page" eyebrow as a <p>');
check(hasAll(classes(/<p\b[^>]*>/.exec(column)?.[0] ?? ""), ["text-eyebrow", "uppercase", "text-accent"]), "column: the eyebrow is text-eyebrow uppercase text-accent");

// Both lists: one <ol role="list">, one <li> and one plain <a href="#id"> per item, in order, with the item's label.
const linkTokens = ["flex", "min-h-11", "items-center", "border-l", "pl-3.5", "text-caption"];
for (const [name, nav] of [["disclosure", disclosure], ["column", column]]) {
  check(count(nav, /<ol\b/g) === 1 && /<ol\b[^>]*role="list"/.test(nav), `${name}: exactly one <ol role="list">`);
  check(count(nav, /<li\b/g) === items.length, `${name}: one <li> per item (${items.length})`);
  const links = [...nav.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  check(links.length === items.length, `${name}: one link per item (${items.length}), found ${links.length}`);
  items.forEach(({ id, label }, i) => {
    const [tag = "", attrs = "", inner = ""] = links[i] ?? [];
    const cls = classes(tag);
    check(/\shref="([^"]*)"/.exec(attrs)?.[1] === `#${id}`, `${name} link ${i + 1}: href must be "#${id}"`);
    check(text(inner) === label, `${name} link ${i + 1}: must read "${label}", found "${text(inner)}"`);
    check(!/\s(?:target|rel|role|tabindex|aria-current)=/.test(attrs), `${name} link ${i + 1}: a plain in-page anchor (no target, rel, role, tabindex or aria-current)`);
    check(hasAll(cls, linkTokens), `${name} link ${i + 1}: needs ${linkTokens.join(" ")} (a 44px target with a left rule)`);
    check(hasAll(cls, focusRing), `${name} link ${i + 1}: needs the ScreenshotViewer focus ring`);
    check(cls.has("text-text-secondary") && cls.has("border-border") && !cls.has("text-text-primary") && !cls.has("border-accent"), `${name} link ${i + 1}: not current, so text-text-secondary with a border-border rule`);
  });
}

// Matrix "Scroll": the pick rule behind aria-current. Tops are relative to the viewport, sections in page order.
const tops = (...values) => values.map((top, i) => ({ id: items[i].id, top }));
check(pickCurrent([], 900, false) === null && pickCurrent([], 900, true) === null, "pick: no sections, no current section");
check(pickCurrent(tops(500, 1500, 2500), 900, false) === "first", "pick: the first section while every top is below the line");
check(pickCurrent(tops(-800, 300, 301), 900, false) === "second", "pick: the last section whose top is at or above the line (a third of the viewport)");
check(pickCurrent(tops(-2000, -1000, 600), 900, true) === "third", "pick: the last section once the page is scrolled to the bottom");
// A 300px viewport puts a third at 100px, above where a jump lands a section (112px); the 120px floor keeps it current.
check(pickCurrent(tops(-500, 112, 900), 300, false) === "second", "pick: on a short viewport the section a jump just landed (top 112px) is current");

// Matrix "Scroll", rendered: with a current section exactly one link carries aria-current="location" and the accent.
const marked = render(h(ContentsList, { items, current: "second", onNavigate: () => {} }));
const markedLinks = [...marked.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
check(count(marked, /\saria-current="location"/g) === 1 && count(marked, /\saria-current=/g) === 1, 'list: exactly one link has aria-current="location"');
markedLinks.forEach((tag, i) => {
  const cls = classes(tag);
  if (items[i].id === "second") {
    check(/\saria-current="location"/.test(tag), "list: the current section's link carries aria-current=\"location\"");
    check(hasAll(cls, ["border-accent", "text-text-primary"]) && !cls.has("border-border") && !cls.has("text-text-secondary"), "list: the current link is border-accent text-text-primary");
  } else {
    check(!/\saria-current=/.test(tag), `list: link ${i + 1} is not current, so no aria-current`);
    check(hasAll(cls, ["border-border", "text-text-secondary"]) && !cls.has("border-accent") && !cls.has("text-text-primary"), `list: link ${i + 1} keeps border-border text-text-secondary`);
  }
});
check(markedLinks.length === items.length, `list: one link per item (${items.length}), found ${markedLinks.length}`);

// Matrix "JavaScript off": nothing is marked current, nothing is a button, no headings, no positive tabindex.
check(!/\saria-current=/.test(html), "island: the server HTML must not carry aria-current (nothing is tracked without JavaScript)");
check(!/<button\b/.test(html), "island: links are anchors, never buttons");
check(!/<h[1-6]\b/.test(html), "island: no headings inside the contents list (the h2 order stays as it is)");
check(![...html.matchAll(/\stabindex="(-?\d+)"/g)].some((m) => Number(m[1]) > 0), "island: no positive tabindex");
check(!/\btext-text-muted\b/.test(html), "tokens: text-muted is for captions and metadata, not the contents list");
check(!/#[0-9a-f]{3,8}\b/i.test(html.replace(/\shref="#[^"]*"/g, "")), "tokens: no raw hex colours");

// The island's own rules: client-only file with plain props, plain anchors, no scroll-jacking.
const tocSrc = readFileSync(join(root, "src", "components", "islands", "TocHighlight.tsx"), "utf8");
check(/^\s*["']use client["']/.test(tocSrc), 'source: TocHighlight.tsx must start with "use client"');
const specifiers = [...tocSrc.matchAll(/^\s*import\b(?:[^;"']*?\bfrom)?\s*["']([^"']+)["']/gm)].map((m) => m[1]);
check(specifiers.length > 0 && specifiers.every((spec) => spec === "react"), `source: TocHighlight.tsx may import only "react" (anything else can grow the home first-load JS), found: ${specifiers.join(", ") || "none"}`);
check(!/\b(?:import|require)\s*\(/.test(tocSrc), "source: no dynamic import() or require() in the island");
check(!/from\s+["']next\/link["']/.test(tocSrc), "source: links are plain <a href>, not next/link");
check(!/\bpreventDefault\s*\(/.test(tocSrc), "source: no preventDefault (the browser follows the link itself)");
check(!/\b(?:scrollTo|scrollBy|scrollIntoView)\s*\(/.test(tocSrc), "source: no scripted scrolling (no scroll-jacking)");
check(/addEventListener\(\s*"scroll"[^)]*\{\s*passive:\s*true\s*\}/.test(tocSrc), "source: the scroll listener must be passive");
check(/preventScroll:\s*true/.test(tocSrc), "source: focusing the target section must not scroll (preventScroll: true)");

// Matrix "Reduced motion": globals.css makes every scroll instant under prefers-reduced-motion, after the
// !scroll-smooth base rule it overrides.
const css = readFileSync(join(root, "src", "app", "globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const smoothAt = css.indexOf("!scroll-smooth");
const reduce = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{\s*\*\s*\{\s*scroll-behavior:\s*auto\s*!important;?\s*\}\s*\}/.exec(css);
check(smoothAt !== -1, "css: globals.css no longer applies !scroll-smooth; update this check with it");
check(!!reduce, "css: globals.css needs @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }");
check(!reduce || reduce.index > smoothAt, "css: the reduced-motion rule must come after the !scroll-smooth rule it overrides");

if (failures.length) {
  console.error(`check:toc failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:toc ok: TocHighlight matches the Story 2.7 I/O matrix");
