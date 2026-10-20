// Story 2.5: render AssistantSection directly (no browser, no test framework) and check the spec's I/O matrix
// rows the built page cannot exercise: a study with no assistant content, the section's shape (one intro <p>,
// one <ul role="list"> of panels with an <h3> each, one closing <p>) and the stacked layout below the md breakpoint.
import { compileComponents, renderTools } from "./lib/render-component.mjs";

// `@/` aliases are rewritten to sibling files; type-only imports are elided (see scripts/lib/render-component.mjs).
const { load } = compileComponents({
  cacheName: "check-assistant",
  aliases: {
    "@/app/lib/utils": "./utils.js",
    "@/components/ui/CaseStudyPanel": "./CaseStudyPanel.js",
  },
  files: {
    "src/app/lib/utils.ts": "utils.js",
    "src/components/ui/CaseStudyPanel.tsx": "CaseStudyPanel.js",
    "src/components/sections/AssistantSection.tsx": "AssistantSection.js",
  },
});
const AssistantSection = await load("AssistantSection.js");
const { h, render, count, failures, check } = await renderTools();

const assistant = {
  intro: "Intro paragraph.",
  safeguards: [
    { title: "First safeguard", text: "First safeguard text." },
    { title: "Second safeguard", text: "Second safeguard text." },
    { title: "Third safeguard", text: "Third safeguard text." },
    { title: "Fourth safeguard", text: "Fourth safeguard text." },
    { title: "Fifth safeguard", text: "Fifth safeguard text." },
  ],
  closing: "Closing paragraph.",
};
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// Matrix: "No assistant content" -> the section is not rendered at all.
check(render(h(AssistantSection, {})) === "", "section: must render nothing when assistant is undefined");

// Matrix: "Section renders" shape, at the component level.
const section = render(h(AssistantSection, { assistant }));
check(/<section\b[^>]*\sid="assistant"/.test(section), 'section: missing <section id="assistant">');
check(/<h2\b[^>]*>\s*Admin AI assistant \(safety design\)\s*<\/h2>/.test(section), "section: h2 must read exactly 'Admin AI assistant (safety design)'");
const h2Id = /<h2\b[^>]*\sid="([^"]+)"/.exec(section)?.[1];
check(!!h2Id && new RegExp(`<section\\b[^>]*aria-labelledby="${h2Id}"`).test(section), "section: aria-labelledby must point at the h2");
check(count(section, /<h2\b/g) === 1 && !/<h4\b|<h5\b|<h6\b/.test(section), "section: exactly one h2 and no deeper headings than h3");
check(count(section, /<article\b/g) === 0, "section: no <article> (the gate treats articles as decision cards)");
check(!/<a\b/.test(section), "section: must not contain links");
check(count(section, /<ul\b/g) === 1 && count(section, /<ul\b[^>]*role="list"/g) === 1, 'section: exactly one <ul role="list"> of panels');
const ulStart = section.indexOf("<ul");
const ulEnd = section.indexOf("</ul>");
const beforeList = ulStart === -1 ? "" : section.slice(0, ulStart);
const list = ulStart === -1 || ulEnd === -1 ? "" : section.slice(ulStart, ulEnd);
const afterList = ulEnd === -1 ? "" : section.slice(ulEnd);
check(count(beforeList, /<p\b/g) === 1 && strip(/<p\b[^>]*>([\s\S]*?)<\/p>/.exec(beforeList)?.[1] ?? "") === assistant.intro, "section: exactly one intro <p> between the h2 and the list, carrying the intro text");
check(count(afterList, /<p\b/g) === 1 && strip(/<p\b[^>]*>([\s\S]*?)<\/p>/.exec(afterList)?.[1] ?? "") === assistant.closing, "section: exactly one closing <p> after the list, carrying the closing text");
check(count(list, /<li\b/g) === assistant.safeguards.length, `section: one <li> per safeguard (${assistant.safeguards.length})`);
check(count(section, /<h3\b/g) === assistant.safeguards.length && count(list, /<h3\b/g) === assistant.safeguards.length, `section: one <h3> per safeguard, all inside the list (${assistant.safeguards.length})`);
const panels = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
assistant.safeguards.forEach((panel, i) => {
  const html = panels[i] ?? "";
  const title = strip(/<h3\b[^>]*>([\s\S]*?)<\/h3>/.exec(html)?.[1] ?? "");
  check(title === panel.title, `panel ${i + 1}: the <h3> must read "${panel.title}", found "${title}"`);
  check(strip(html).includes(panel.text), `panel ${i + 1}: body text missing: "${panel.text}"`);
  check(html.indexOf("<h3") < html.indexOf("<p"), `panel ${i + 1}: the heading comes before the body`);
});
check(!/<[^>]*>\s*undefined\s*</.test(section) && !/>\s*null\s*</.test(section), "section: never prints undefined or null");
const intro = /<p\b[^>]*class="([^"]*)"/.exec(beforeList)?.[1] ?? "";
const closing = /<p\b[^>]*class="([^"]*)"/.exec(afterList)?.[1] ?? "";
for (const [name, cls] of [["intro", intro], ["closing", closing]]) {
  check(/(?:^|\s)max-w-\[68ch\](?:\s|$)/.test(cls) && /\btext-body\b/.test(cls) && /\btext-text-secondary\b/.test(cls), `section: the ${name} <p> is max-w-[68ch] text-body text-text-secondary`);
}

// Matrix: "Narrow viewport" -> panels stack by default, two columns only from md:, nothing hidden, no fixed widths.
const grid = /<ul\b[^>]*role="list"[^>]*class="([^"]*)"/.exec(section)?.[1] ?? "";
check(/\bgrid\b/.test(grid) && /\bgrid-cols-1\b/.test(grid), "layout: the panel grid must default to grid-cols-1");
check(/\bmd:grid-cols-2\b/.test(grid), "layout: two columns only from md: (md:grid-cols-2)");
check(!/(^|\s)grid-cols-2\b/.test(grid) && !/\blg:grid-cols-/.test(grid), "layout: grid-cols-2 must be md:-prefixed, never unconditional, and no third column");
const classAttrs = [...section.matchAll(/\sclass="([^"]*)"/g)].map((m) => m[1]);
check(!classAttrs.some((c) => /(?:^|\s)(?:[a-z-]+:)*(?:hidden|sr-only|invisible)(?:\s|$)/.test(c)) && !/<details\b/.test(section), "layout: nothing may be hidden behind disclosure or utility classes");
check(!/(?:^|[\s":])(?:min-)?w-(?:\[|\d|screen|full)|whitespace-nowrap/.test(section), "layout: no fixed widths or nowrap that could cause horizontal scroll at 390px (max-w- is fine)");
check(!/\boverflow-x-(?:auto|scroll)\b/.test(section), "layout: no horizontal scroll container");
check(count(section, /aria-hidden="true"/g) === 0, "layout: nothing is aria-hidden; every panel is read out");
check(!/<(?:img|svg|picture|canvas)\b/.test(section), "layout: real text only, no images or SVG");
check(!/\b(?:bg-|text-|border-)success\b/.test(section), "tokens: the success colour is reserved for shipped, live or passing-test indicators");
check(!/\btext-text-muted\b/.test(section), "tokens: text-muted is for captions and metadata; this section has neither");
check(!/#[0-9a-f]{3,8}\b/i.test(section), "tokens: no raw hex colours");
check(strip(section).includes("Intro paragraph. First safeguard First safeguard text. Second safeguard"), "section: text reads intro, then each panel's title and body in order");
check(strip(section).endsWith("Fifth safeguard text. Closing paragraph."), "section: the closing paragraph is the last text");

if (failures.length) {
  console.error(`check:assistant failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:assistant ok: AssistantSection matches the Story 2.5 I/O matrix");
