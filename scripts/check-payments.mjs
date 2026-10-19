// Story 2.2: render StateDiagram and PaymentsSection directly (no browser, no test framework) and check the
// spec's I/O matrix rows the built page cannot exercise: a study with no payments content, the diagram's
// accessibility (ordered real text, figure named by its figcaption, aria-hidden glyphs) and the stacked
// layout below the md breakpoint.
import { compileComponents, renderTools } from "./lib/render-component.mjs";

const { load } = compileComponents({
  cacheName: "check-payments",
  aliases: {
    "@/app/lib/utils": "./utils.js",
    "@/components/ui/CaseStudyPanel": "./CaseStudyPanel.js",
    "@/components/ui/StateDiagram": "./StateDiagram.js",
  },
  files: {
    "src/app/lib/utils.ts": "utils.js",
    "src/components/ui/CaseStudyPanel.tsx": "CaseStudyPanel.js",
    "src/components/ui/StateDiagram.tsx": "StateDiagram.js",
    "src/components/sections/PaymentsSection.tsx": "PaymentsSection.js",
  },
});
const StateDiagram = await load("StateDiagram.js");
const PaymentsSection = await load("PaymentsSection.js");
const { h, render, count, failures, check } = await renderTools();

const payments = {
  flow: ["First paragraph.", "Second paragraph.", "Third paragraph.", "Fourth paragraph."],
  diagram: {
    states: [
      { state: "Alpha state", meaning: "Alpha meaning." },
      { state: "Beta state", meaning: "Beta meaning." },
      { state: "Gamma state", meaning: "Gamma meaning." },
    ],
    transitions: ["Alpha to beta", "Beta to gamma"],
    caption: "Example caption naming the figure.",
  },
  reliability: [
    { title: "First panel", text: "First panel text." },
    { title: "Second panel", text: "Second panel text." },
  ],
};
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// Matrix: "No payments content" -> the section is not rendered at all.
check(render(h(PaymentsSection, {})) === "", "section: must render nothing when payments is undefined");

// Matrix: "Section renders" shape, at the component level.
const section = render(h(PaymentsSection, { payments }));
check(/<section\b[^>]*\sid="payments"/.test(section), 'section: missing <section id="payments">');
check(/<h2\b[^>]*>\s*The booking and payments flow\s*<\/h2>/.test(section), "section: h2 must read exactly 'The booking and payments flow'");
const h2Id = /<h2\b[^>]*\sid="([^"]+)"/.exec(section)?.[1];
check(!!h2Id && new RegExp(`<section\\b[^>]*aria-labelledby="${h2Id}"`).test(section), "section: aria-labelledby must point at the h2");
const figureAt = section.indexOf("<figure");
check(figureAt !== -1, "section: must contain the <figure> diagram");
check(count(section.slice(0, figureAt), /<p\b/g) === payments.flow.length, `section: one <p> per flow paragraph before the figure (${payments.flow.length})`);
check(count(section, /<article\b/g) === 0, "section: no <article> (the gate treats articles as decision cards)");
check(count(section, /<h3\b/g) === payments.reliability.length, `section: one <h3> per reliability panel (${payments.reliability.length})`);
check(count(section, /<h2\b/g) === 1 && !/<h4\b|<h5\b|<h6\b/.test(section), "section: exactly one h2 and no deeper headings than h3");
check(/>\s*Reliability decisions\s*</.test(section) && !/<h[1-6]\b[^>]*>\s*Reliability decisions/.test(section), 'section: "Reliability decisions" is an eyebrow <p>, not a heading');
const panelGrid = /<ul\b[^>]*role="list"[^>]*class="([^"]*)"/.exec(section)?.[1] ?? "";
check(/\bgrid-cols-1\b/.test(panelGrid) && /\bmd:grid-cols-2\b/.test(panelGrid), "section: the panel grid must be grid-cols-1 with md:grid-cols-2");
check(!/<a\b/.test(section), "section: must not contain links");

// Matrix: "Diagram accessibility" -> one ordered list of real text, figure named by its figcaption, glyphs hidden.
const figure = render(h(StateDiagram, { id: "example", ...payments.diagram }));
check(count(figure, /<figure\b/g) === 1 && count(figure, /<figcaption\b/g) === 1, "diagram: exactly one <figure> with one <figcaption>");
const labelledBy = /<figure\b[^>]*aria-labelledby="([^"]+)"/.exec(figure)?.[1];
check(!!labelledBy && new RegExp(`<figcaption\\b[^>]*\\sid="${labelledBy}"`).test(figure), "diagram: the figure must be named by its figcaption (aria-labelledby -> figcaption id)");
check(figure.includes(payments.diagram.caption), "diagram: caption text missing");
check(count(figure, /<ol\b[^>]*role="list"/g) === 1, 'diagram: states and transitions must sit in one <ol role="list">');
const items = [...figure.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => strip(m[1]).trim());
const expectedOrder = [];
payments.diagram.states.forEach((s, i) => {
  expectedOrder.push(s.state);
  if (i < payments.diagram.states.length - 1) expectedOrder.push(payments.diagram.transitions[i]);
});
check(items.length === expectedOrder.length, `diagram: expected ${expectedOrder.length} list items (states and transitions interleaved), found ${items.length}`);
expectedOrder.forEach((text, i) => check(items[i]?.includes(text), `diagram: list item ${i + 1} should read "${text}", found "${items[i]}"`));
for (const s of payments.diagram.states) check(figure.includes(s.meaning), `diagram: meaning missing for ${s.state}`);
check(!/<(?:img|svg|picture|canvas)\b/.test(figure), "diagram: real text only, no image or SVG");
const glyphs = figure.match(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g) ?? [];
check(glyphs.length === payments.diagram.transitions.length, `diagram: one aria-hidden connector glyph per transition, found ${glyphs.length}`);
for (const [, text] of figure.matchAll(/<span\b[^>]*aria-hidden="true"[^>]*>([\s\S]*?)<\/span>/g)) {
  check(!/[A-Za-z]/.test(strip(text)), `diagram: aria-hidden glyph must not hide words: "${strip(text).trim()}"`);
}
check(/<span\b[^>]*>\s*(?:&rarr;|→|&#8594;)\s*<\/span>/.test(figure), "diagram: the connector glyph is an arrow");

// Matrix: "Narrow viewport" -> states stack by default, a row only from md:, nothing hidden, no fixed widths.
const ol = /<ol\b[^>]*class="([^"]*)"/.exec(figure)?.[1] ?? "";
check(/\bflex-col\b/.test(ol), "diagram: the list must default to flex-col (stacked)");
check(/\bmd:flex-row\b/.test(ol), "diagram: the row layout must only appear from md: (md:flex-row)");
check(!/(^|\s)flex-row\b/.test(ol), "diagram: flex-row must be md:-prefixed, never unconditional");
const classAttrs = [...section.matchAll(/\sclass="([^"]*)"/g)].map((m) => m[1]);
check(!classAttrs.some((c) => /(?:^|\s)(?:hidden|sr-only|invisible)(?:\s|$)/.test(c)) && !/<details\b/.test(section), "section: nothing may be hidden behind disclosure or utility classes (aria-hidden glyphs aside)");
check(!/(?:^|[\s":])(?:min-)?w-\[|whitespace-nowrap/.test(section), "section: no fixed widths or nowrap that could cause horizontal scroll at 390px (max-w- is fine)");
check(count(section, /aria-hidden="true"/g) === payments.diagram.transitions.length, "section: the connector glyphs must be the only aria-hidden elements");
check(!/\boverflow-x-(?:auto|scroll)\b/.test(section), "section: no horizontal scroll container");
check(!/\b(?:bg-|text-|border-)success\b/.test(section), "section: the success colour is reserved for shipped, live or passing-test indicators");
const mutedUses = [...section.matchAll(/<(\w+)\b[^>]*class="[^"]*\btext-text-muted\b[^"]*"/g)].map((m) => m[1]);
check(mutedUses.every((tag) => tag === "figcaption" || tag === "li"), `section: text-muted only on the caption and transition labels, found on: ${mutedUses.join(", ")}`);

if (failures.length) {
  console.error(`check:payments failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:payments ok: StateDiagram and PaymentsSection match the Story 2.2 I/O matrix");
