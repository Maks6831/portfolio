// Story 9 (v3 CAP-8, gates.md): render OnThisPage directly (no browser, no test framework) and check what holds in the
// static HTML. TocHighlight is gone, so the page has no script for the list: one `nav aria-label="On this page"` that
// holds seven plain anchors for lg and, for smaller screens, a collapsed native <details> with a 44px summary, 44px
// rows and an aria-hidden indicator. Nothing is marked current, no tabindex is positive, the component is a server
// component, and anchor jumps are instant under reduced motion (globals.css).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compileComponents, renderTools, root } from "./lib/render-component.mjs";

const { load } = compileComponents({
  cacheName: "check-toc",
  aliases: {},
  files: { "src/components/case-study/OnThisPage.tsx": "OnThisPage.js" },
});
const OnThisPage = await load("OnThisPage.js");
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
const focusRing = ["focus-visible:outline", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-focus-ring"];

check(render(h(OnThisPage, { items: [] })) === "", "component: must render nothing when there are no items");
const html = render(h(OnThisPage, { items }));

// One landmark.
check(count(html, /<nav\b/g) === 1, `component: exactly one <nav>, found ${count(html, /<nav\b/g)}`);
check(/^<nav\b[^>]*\saria-label="On this page"/.test(html), 'component: the nav is named aria-label="On this page"');
check(/^<nav\b[^>]*\sid="on-this-page"/.test(html), 'component: the nav has id="on-this-page" (the heading blocks link back to it)');

// The disclosure (below lg): one closed <details>, summary first, 44px, with an aria-hidden indicator.
const wrap = /<div\b[^>]*class="([^"]*)"[^>]*>(<details[\s\S]*?<\/details>)<\/div>/.exec(html);
check(!!wrap && classes(`<x class="${wrap[1]}">`).has("lg:hidden"), "disclosure: the <details> sits in a wrapper hidden from lg (lg:hidden)");
const disclosure = wrap?.[2] ?? "";
const detailsTags = disclosure.match(/<details\b[^>]*>/g) ?? [];
check(detailsTags.length === 1 && count(html, /<details\b/g) === 1, "disclosure: exactly one <details>");
check(!/\sopen(?=[\s=>])/.test(detailsTags[0] ?? ""), "disclosure: the <details> must be closed in the HTML (no open attribute)");
check(/<details\b[^>]*>\s*<summary\b/.test(disclosure), "disclosure: <summary> must be the first child of <details>");
const summaryTag = /<summary\b[^>]*>/.exec(disclosure)?.[0] ?? "";
const summary = /<summary\b[^>]*>([\s\S]*?)<\/summary>/.exec(disclosure)?.[1] ?? "";
check(text(summary).startsWith(`On this page · ${items.length} sections`), `disclosure: <summary> must read "On this page · ${items.length} sections", found "${text(summary)}"`);
check(classes(summaryTag).has("min-h-11"), "disclosure: <summary> needs a 44px target (min-h-11)");
check(hasAll(classes(summaryTag), focusRing), "disclosure: <summary> needs the focus ring");
check(/\[&(?:amp;)?::-webkit-details-marker\]:hidden/.test(summaryTag), "disclosure: the webkit marker is hidden");
const indicator = /<span\b[^>]*aria-hidden="true"[^>]*>([\s\S]*?)<\/span>\s*<\/summary>/.exec(disclosure);
check(!!indicator && /\+/.test(indicator[1]) && /–/.test(indicator[1]), "disclosure: the +/– indicator is an aria-hidden span inside <summary>");
check(!/content-\[|after:content|before:content/.test(html), "disclosure: the indicator is real text, not CSS content");

// Both lists: one <ol role="list">, one <li> and one plain <a href="#id"> per item, in order, with the label.
const lists = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/g) ?? [];
check(lists.length === 2, `component: two lists (disclosure rows and the lg row), found ${lists.length}`);
const inDisclosure = (list) => disclosure.includes(list);
for (const list of lists) {
  const name = inDisclosure(list) ? "disclosure" : "lg row";
  check(/^<ol\b[^>]*role="list"/.test(list), `${name}: <ol role="list">`);
  const links = [...list.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  check(links.length === items.length && count(list, /<li\b/g) === items.length, `${name}: one <li> and one link per item (${items.length}), found ${links.length}`);
  items.forEach(({ id, label }, i) => {
    const [tag = "", attrs = "", inner = ""] = links[i] ?? [];
    check(/\shref="([^"]*)"/.exec(attrs)?.[1] === `#${id}`, `${name} link ${i + 1}: href must be "#${id}"`);
    check(text(inner) === `0${i + 1} ${label}`, `${name} link ${i + 1}: must read "0${i + 1} ${label}", found "${text(inner)}"`);
    check(!/\s(?:target|rel|role|tabindex|aria-current)=/.test(attrs), `${name} link ${i + 1}: a plain in-page anchor (no target, rel, role, tabindex or aria-current)`);
    check(hasAll(classes(tag), focusRing), `${name} link ${i + 1}: needs the focus ring`);
    if (inDisclosure(list)) check(classes(tag).has("min-h-11"), `${name} link ${i + 1}: 44px row (min-h-11)`);
  });
}
// The lg row is shown from lg only.
const rowWrap = /<div\b[^>]*class="([^"]*)"[^>]*>(?:(?!<div)[\s\S])*?<ol\b/.exec(html.slice(html.indexOf("</details>")));
check(!!rowWrap && hasAll(classes(`<x class="${rowWrap[1]}">`), ["hidden", "lg:flex"]), "lg row: hidden below lg and a flex row from lg (hidden lg:flex)");

// Server HTML: nothing current, no buttons, no headings, no positive tabindex, no raw hex.
check(!/\saria-current=/.test(html), "component: nothing is marked current (the tab trail and heading blocks do that)");
check(!/<button\b/.test(html) && !/<h[1-6]\b/.test(html), "component: anchors only, no buttons or headings");
check(![...html.matchAll(/\stabindex="(-?\d+)"/g)].some((m) => Number(m[1]) > 0), "component: no positive tabindex");
check(!/#[0-9a-f]{3,8}\b/i.test(html.replace(/\shref="#[^"]*"/g, "").replace(/\sid="[^"]*"/g, "")), "tokens: no raw hex colours");

// No script: the component is a server component with no imports, and TocHighlight is gone.
const src = readFileSync(join(root, "src", "components", "case-study", "OnThisPage.tsx"), "utf8");
check(!/^\s*["']use client["']/.test(src), "source: OnThisPage is a server component (no \"use client\")");
check(!/^\s*import\b/m.test(src), "source: OnThisPage imports nothing");
check(!existsSync(join(root, "src", "components", "islands", "TocHighlight.tsx")), "source: TocHighlight.tsx must be deleted");

// Reduced motion: globals.css makes every scroll instant after the `html { scroll-behavior: smooth }` base rule.
const css = readFileSync(join(root, "src", "app", "globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const smoothAt = css.search(/html\s*\{\s*scroll-behavior:\s*smooth;?\s*\}/);
const reduce = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{\s*\*\s*\{\s*scroll-behavior:\s*auto\s*!important;?\s*\}\s*\}/.exec(css);
check(smoothAt !== -1, "css: globals.css no longer has html { scroll-behavior: smooth }; update this check with it");
check(!!reduce, "css: globals.css needs @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }");
check(!reduce || reduce.index > smoothAt, "css: the reduced-motion rule must come after the html smooth-scroll rule it overrides");

if (failures.length) {
  console.error(`check:toc failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:toc ok: OnThisPage is one nav with seven anchors at lg and a closed disclosure below; TocHighlight is gone");
