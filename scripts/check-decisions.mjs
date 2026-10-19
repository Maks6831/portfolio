// Story 2.3: render DecisionCard and DecisionsSection directly (no browser, no test framework) and check the
// spec's I/O matrix rows the built page cannot exercise: a card without `source`, a study with no decisions,
// and the stacked single-column layout below the md breakpoint.
import { compileComponents, renderTools } from "./lib/render-component.mjs";

// `@/` aliases are rewritten to sibling files; type-only imports are elided (see scripts/lib/render-component.mjs).
const { load } = compileComponents({
  cacheName: "check-decisions",
  aliases: {
    "@/app/lib/utils": "./utils.js",
    "@/components/ui/DecisionCard": "./DecisionCard.js",
  },
  files: {
    "src/app/lib/utils.ts": "utils.js",
    "src/components/ui/DecisionCard.tsx": "DecisionCard.js",
    "src/components/sections/DecisionsSection.tsx": "DecisionsSection.js",
  },
});
const DecisionCard = await load("DecisionCard.js");
const DecisionsSection = await load("DecisionsSection.js");
const { h, render, count, failures, check } = await renderTools();

const withSource = { title: "Example decision", chose: "The thing I chose.", rejected: "The thing I rejected.", source: "the example module" };
const withoutSource = { title: withSource.title, chose: withSource.chose, rejected: withSource.rejected };

// Matrix: "Section renders" shape, at the component level.
const full = render(h(DecisionCard, withSource));
check(count(full, /<article\b/g) === 1, "card: must render exactly one <article>");
check(count(full, /<h3\b/g) === 1, "card: must render exactly one <h3> title");
check(/>\s*Chose\s*</.test(full), 'card: missing the "Chose" label');
check(/>\s*Rejected, because\s*</.test(full), 'card: missing the "Rejected, because" label');
check(full.includes("The thing I chose."), "card: chose text missing");
check(full.includes("The thing I rejected."), "card: rejected text missing");
check(/Where this lives:\s*(<!--\s*-->)?\s*the example module/.test(full), 'card: "Where this lives" line must show the source');
check(!/<a\b/.test(full), "card: must not contain links");

// Matrix: "Card without source" -> both columns, no "Where this lives" line.
const bare = render(h(DecisionCard, withoutSource));
check(/>\s*Chose\s*</.test(bare) && />\s*Rejected, because\s*</.test(bare), "card without source: both column labels must still render");
check(!bare.includes("Where this lives"), 'card without source: must omit the "Where this lives" line');

// Matrix: "Narrow viewport" -> columns stack by default; two columns only from the md breakpoint, nothing hidden.
const dl = /<dl\b[^>]*class="([^"]*)"/.exec(full)?.[1] ?? "";
check(/\bgrid-cols-1\b/.test(dl), "card: the two-column grid must default to a single column (grid-cols-1)");
check(/\bmd:grid-cols-2\b/.test(dl), "card: the second column must only appear from md: (md:grid-cols-2)");
check(!/(^|\s)grid-cols-2\b/.test(dl), "card: grid-cols-2 must be md:-prefixed, never unconditional");
const cardClasses = [...full.matchAll(/\sclass="([^"]*)"/g)].map((m) => m[1]);
check(!cardClasses.some((c) => /(?:^|\s)(?:hidden|sr-only|invisible)(?:\s|$)/.test(c)) && !/<details\b/.test(full), "card: nothing may be hidden behind disclosure or utility classes");
check(!/(?:^|[\s":])(?:min-)?w-\[|whitespace-nowrap/.test(full), "card: no fixed widths or nowrap that could cause horizontal scroll at 390px (max-w- is fine)");

// Matrix: "No decisions" -> the section is not rendered at all.
check(render(h(DecisionsSection, {})) === "", "section: must render nothing when decisions is undefined");
check(render(h(DecisionsSection, { decisions: [] })) === "", "section: must render nothing when decisions is empty");

// Section with content: id, heading, one card per decision, single-column list.
const section = render(h(DecisionsSection, { decisions: [withSource, { ...withoutSource, title: "Second" }] }));
check(section.includes('id="decisions"'), 'section: missing id="decisions"');
check(/<h2\b[^>]*>\s*Decisions and rejected alternatives\s*<\/h2>/.test(section), "section: h2 must read exactly 'Decisions and rejected alternatives'");
check(count(section, /<article\b/g) === 2, "section: one <article> per decision");
check(count(section, /<h3\b/g) === 2, "section: one <h3> per decision");
check(count(section, /Rejected, because/g) === 2, '"Rejected, because" once per card');
check(/<ul\b[^>]*role="list"/.test(section), 'section: cards must be listed in a <ul role="list">');
const ul = /<ul\b[^>]*class="([^"]*)"/.exec(section)?.[1] ?? "";
check(/\bgrid-cols-1\b/.test(ul), "section: the card list must be a single column (grid-cols-1)");
check(!/\b(?:md|lg):grid-cols-/.test(ul), "section: the card list must stay single-column at every breakpoint (no md:/lg:grid-cols-)");
check(count(section, /Where this lives/g) === 1, "section: only the card with a source shows 'Where this lives'");

if (failures.length) {
  console.error(`check:decisions failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:decisions ok: DecisionCard and DecisionsSection match the Story 2.3 I/O matrix");
