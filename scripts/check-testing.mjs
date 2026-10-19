// Story 2.4: render TestingSection directly (no browser, no test framework) and check the spec's I/O matrix
// rows the built page cannot exercise: a study with no testing content, a tile without a detail line, the
// two-column tile layout below the md breakpoint, and the as-of date formatting (valid and malformed).
import { compileComponents, renderTools } from "./lib/render-component.mjs";

// `@/` aliases are rewritten to sibling files; type-only imports are elided (see scripts/lib/render-component.mjs).
const { load } = compileComponents({
  cacheName: "check-testing",
  aliases: {
    "@/app/lib/utils": "./utils.js",
    "@/lib/dates": "./dates.js",
  },
  files: {
    "src/app/lib/utils.ts": "utils.js",
    "src/lib/dates.ts": "dates.js",
    "src/components/sections/TestingSection.tsx": "TestingSection.js",
  },
});
const TestingSection = await load("TestingSection.js");
const { h, render, count, failures, check } = await renderTools();

const testing = {
  countsAsOf: "2026-10-18",
  counts: [
    { label: "First files", value: "12", detail: "first detail line" },
    { label: "Second tests", value: "about 34", detail: "second detail line" },
    { label: "Third files", value: "56" },
    { label: "Fourth files", value: "78", detail: "fourth detail line" },
  ],
  paragraphs: ["First paragraph.", "Second paragraph.", "Third paragraph."],
};
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// Matrix: "No testing content" -> the section is not rendered at all.
check(render(h(TestingSection, {})) === "", "section: must render nothing when testing is undefined");

// Matrix: "Section renders" shape, at the component level.
const section = render(h(TestingSection, { testing }));
check(/<section\b[^>]*\sid="testing"/.test(section), 'section: missing <section id="testing">');
check(/<h2\b[^>]*>\s*Testing and delivery\s*<\/h2>/.test(section), "section: h2 must read exactly 'Testing and delivery'");
const h2Id = /<h2\b[^>]*\sid="([^"]+)"/.exec(section)?.[1];
check(!!h2Id && new RegExp(`<section\\b[^>]*aria-labelledby="${h2Id}"`).test(section), "section: aria-labelledby must point at the h2");
check(count(section, /<h2\b/g) === 1 && !/<h[3-6]\b/.test(section), "section: exactly one h2 and no deeper headings (no <h3>: the gate counts h3s as panels)");
check(count(section, /<article\b/g) === 0, "section: no <article> (the gate treats articles as decision cards)");
check(!/<a\b/.test(section), "section: must not contain links");
check(count(section, /<dl\b/g) === 1, "section: exactly one <dl> of tiles");
check(!/<dl\b[^>]*\srole=/.test(section), "section: the <dl> carries no role attribute");
const dl = /<dl\b[^>]*>[\s\S]*?<\/dl>/.exec(section)?.[0] ?? "";
check(count(dl, /<dt\b/g) === testing.counts.length, `section: one <dt> per tile (${testing.counts.length})`);
const details = testing.counts.filter((t) => t.detail).length;
check(count(dl, /<dd\b/g) === testing.counts.length + details, `section: one value <dd> per tile plus one per detail (${testing.counts.length + details})`);
const tiles = [...dl.matchAll(/<div\b[^>]*>([\s\S]*?)<\/div>/g)].map((m) => m[1]);
check(tiles.length === testing.counts.length, `section: one tile <div> per count, found ${tiles.length}`);
const inner = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => strip(m[1]));
testing.counts.forEach((tile, i) => {
  const html = tiles[i] ?? "";
  check(inner(html, "dt").length === 1 && inner(html, "dt")[0] === tile.label, `tile ${i + 1}: the <dt> text must equal the label "${tile.label}"`);
  check(inner(html, "dd")[0] === tile.value, `tile ${i + 1}: the first <dd> text must equal the value "${tile.value}"`);
  check(html.indexOf("<dt") < html.indexOf("<dd"), `tile ${i + 1}: the label comes before the value`);
});
const afterList = section.slice(section.indexOf("</dl>"));
check(count(afterList, /<p\b/g) === testing.paragraphs.length, `section: one <p> per paragraph after the list (${testing.paragraphs.length})`);
for (const p of testing.paragraphs) check(section.includes(p), `section: paragraph text missing: "${p}"`);

// Matrix: "Tile without detail" -> label and value only, no empty element.
const bare = tiles[2] ?? "";
check(count(bare, /<dd\b/g) === 1, "tile without detail: exactly one <dd> (the value)");
check(!/<(dd|dt|p|span)\b[^>]*>\s*<\/\1>/.test(bare), "tile without detail: no empty element");
check(!/<[^>]*>\s*undefined\s*</.test(section) && !/>\s*null\s*</.test(section), "section: never prints undefined or null");
const withDetail = tiles[0] ?? "";
check(withDetail.includes(testing.counts[0].detail), "tile with detail: the detail line must render");
check(/<dd\b[^>]*\btext-text-muted\b[^>]*>\s*first detail line\s*<\/dd>/.test(withDetail), "tile with detail: the detail line is a text-muted <dd>");

// Matrix: "Date formatting" -> ISO in content, "D Mon YYYY" on the page, once; malformed renders no date.
const label = /<p\b[^>]*>\s*(approx\.[^<]*)<\/p>/.exec(section)?.[1]?.trim();
check(label === "approx., as of 18 Oct 2026", `section: as-of label must read "approx., as of 18 Oct 2026", found "${label}"`);
check(count(section, /approx\., as of/g) === 1, "section: the as-of label appears exactly once");
check(!section.includes("2026-10-18"), "section: the ISO date must not leak into the markup");
const asOfP = /<p\b[^>]*class="([^"]*)"[^>]*>\s*approx\./.exec(section)?.[1] ?? "";
check(/\btext-caption\b/.test(asOfP) && /\btext-text-muted\b/.test(asOfP), "section: the as-of label is text-caption text-text-muted");
check(section.indexOf("approx., as of") < section.indexOf("<dl"), "section: the as-of label comes before the tiles");
const asOfId = /<p\b[^>]*\sid="([^"]+)"[^>]*>\s*approx\./.exec(section)?.[1];
check(asOfId === "testing-asof" && /<dl\b[^>]*aria-describedby="testing-asof"/.test(section), 'section: the <dl> must be described by the as-of <p> (id="testing-asof", aria-describedby)');
for (const bad of ["2026-13-01", "2026-10-32", "18 Oct 2026", "", "2026-02-30"]) {
  const out = render(h(TestingSection, { testing: { ...testing, countsAsOf: bad } }));
  check(!/as of/.test(out) && !/\d{4}-\d{2}-\d{2}/.test(out) && !/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}/.test(out), `malformed countsAsOf "${bad}": must render no date at all`);
  check(/<p\b[^>]*>\s*approx\.\s*<\/p>/.test(out), `malformed countsAsOf "${bad}": the label still says "approx."`);
}

// Matrix: "Narrow viewport" -> two columns by default, four only from md:, nothing hidden, no fixed widths.
const dlClass = /<dl\b[^>]*class="([^"]*)"/.exec(section)?.[1] ?? "";
check(/\bgrid\b/.test(dlClass) && /\bgrid-cols-2\b/.test(dlClass), "layout: the tile list must default to grid-cols-2");
check(/\bmd:grid-cols-4\b/.test(dlClass), "layout: four columns only from md: (md:grid-cols-4)");
check(!/(^|\s)grid-cols-4\b/.test(dlClass), "layout: grid-cols-4 must be md:-prefixed, never unconditional");
const classAttrs = [...section.matchAll(/\sclass="([^"]*)"/g)].map((m) => m[1]);
check(!classAttrs.some((c) => /(?:^|\s)(?:[a-z-]+:)*(?:hidden|sr-only|invisible)(?:\s|$)/.test(c)) && !/<details\b/.test(section), "layout: nothing may be hidden behind disclosure or utility classes");
check(!/(?:^|[\s":])(?:min-)?w-\[|whitespace-nowrap/.test(section), "layout: no fixed widths or nowrap that could cause horizontal scroll at 390px (max-w- is fine)");
check(!/\boverflow-x-(?:auto|scroll)\b/.test(section), "layout: no horizontal scroll container");
check(count(section, /aria-hidden="true"/g) === 0, "layout: nothing is aria-hidden; every tile is read out");
check(!/<(?:img|svg|picture|canvas)\b/.test(section), "layout: real text only, no images or SVG");
check(!/\b(?:bg-|text-|border-)success\b/.test(section), "tokens: the success colour is reserved for shipped, live or passing-test indicators");
check(!/#[0-9a-f]{3,8}\b/i.test(section), "tokens: no raw hex colours");
const mutedUses = [...section.matchAll(/<(\w+)\b[^>]*class="[^"]*\btext-text-muted\b[^"]*"/g)].map((m) => m[1]);
check(mutedUses.length === 1 + details && mutedUses.every((tag) => tag === "p" || tag === "dd"), `tokens: text-muted only on the as-of label and the detail lines, found on: ${mutedUses.join(", ")}`);
check(strip(section).includes("First files 12 first detail line Second tests about 34"), "section: tile text reads label, value, detail in order");

if (failures.length) {
  console.error(`check:testing failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log("check:testing ok: TestingSection matches the Story 2.4 I/O matrix");
