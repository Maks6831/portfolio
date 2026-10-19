// Story 2.3: render DecisionCard and DecisionsSection directly (no browser, no test framework) and check the
// spec's I/O matrix rows the built page cannot exercise: a card without `source`, a study with no decisions,
// and the stacked single-column layout below the md breakpoint.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "node_modules", ".cache", "check-decisions");
mkdirSync(outDir, { recursive: true });

// Transpile the three source files to plain ESM in a cache folder under node_modules so `react`, `clsx` and
// `tailwind-merge` resolve as usual. `@/` aliases are rewritten to sibling files; type-only imports are elided.
const aliases = {
  "@/app/lib/utils": "./utils.js",
  "@/components/ui/DecisionCard": "./DecisionCard.js",
};
const emit = (rel, name) => {
  const source = readFileSync(join(root, rel), "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: rel,
    reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  if (diagnostics?.length) throw new Error(`${rel}: ${diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("; ")}`);
  const js = outputText.replace(/from "(@\/[^"]+)"/g, (m, spec) => {
    if (!aliases[spec]) throw new Error(`${rel}: unmapped alias import ${spec}`);
    return `from "${aliases[spec]}"`;
  });
  writeFileSync(join(outDir, name), js);
};
emit("src/app/lib/utils.ts", "utils.js");
emit("src/components/ui/DecisionCard.tsx", "DecisionCard.js");
emit("src/components/sections/DecisionsSection.tsx", "DecisionsSection.js");

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement: h } = await import("react");
const DecisionCard = (await import(pathToFileURL(join(outDir, "DecisionCard.js")).href)).default;
const DecisionsSection = (await import(pathToFileURL(join(outDir, "DecisionsSection.js")).href)).default;

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const render = (el) => renderToStaticMarkup(el);
const count = (html, re) => (html.match(re) ?? []).length;

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
check(!/\b(hidden|sr-only|invisible)\b/.test(full) && !/<details\b/.test(full), "card: nothing may be hidden behind disclosure or utility classes");
check(!/(?:^|[\s"])(?:w-\[|min-w-\[|whitespace-nowrap)/.test(full), "card: no fixed widths or nowrap that could cause horizontal scroll at 390px");

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
