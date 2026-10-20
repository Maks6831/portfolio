// Story 2.1: the case-study route, its metadata, robots, sitemap and the Person JSON-LD
// must come out of the static build exactly as specified (spec I/O matrix).
// Story 2.6: the Screenshots section, its "Test data" captions, the files behind it and the island set.
// Story 2.3: the Decisions section between #owned and #screenshots, one card per decision with both columns.
// Story 2.2: the Payments section between #owned and #decisions: four paragraphs, the state diagram, two panels,
// and its honesty rules ("a daily job", never a time; no currency, URL, path or link).
// Story 2.4: the Testing section between #decisions and #screenshots: one <dl> of count tiles under a single
// "approx., as of" label, three paragraphs, and its honesty rules (approximate counts; CI only on pull requests;
// Storybook only as local; no snapshots, URL, path, file name, domain or link).
// Story 2.5: the Assistant section between #testing and #screenshots: one intro paragraph, five safeguard panels (an <h3>
// each) and one closing paragraph, and its honesty rules (seven read-only lookups, browser-tab chats, the tested excluded
// fields, a monthly cap with no amount, an off switch; no vendor or model name, currency, "daily limit", URL, path, file
// name, domain or link).
// Story 2.7: the contents list between the <h1> and #summary: a closed small-screen disclosure and a sticky column,
// both listing every <section id> in source order with the agreed labels; every section takes focus; no aria-current.
// Story 2.9: the home hero button, feature link and assistant tile open the case study in place; home has no link to
// the client's site (the case study keeps the only one); the feature image is the test-data booking screenshot.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const app = join(root, ".next", "server", "app");

if (!existsSync(app)) {
  console.error("check:case-study: .next not found; run next build first");
  process.exit(1);
}

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const attr = (html, re) => { const m = re.exec(html); return m ? decode(m[1]) : null; };

// Known slug is prerendered; no other slug is, and unknown slugs 404 at the routing layer.
const workDir = join(app, "work");
const htmls = existsSync(workDir) ? readdirSync(workDir).filter((f) => f.endsWith(".html")) : [];
check(htmls.length === 1 && htmls[0] === "simply-happy.html", `work/ should hold only simply-happy.html, found: ${htmls.join(", ") || "none"}`);
try {
  const manifest = JSON.parse(read(join(root, ".next", "prerender-manifest.json")) ?? "{}");
  check(manifest.dynamicRoutes?.["/work/[slug]"]?.fallback === false, "prerender-manifest: /work/[slug] must have fallback === false (dynamicParams = false)");
} catch { failures.push("prerender-manifest.json does not parse"); }

// Counts derived from the content module so the gate tracks src/content/work/simply-happy.ts rather than literals.
const contentSrc = read(join(root, "src", "content", "work", "simply-happy.ts")) ?? "";
const expectedOwned = (contentSrc.match(/^\s*body:\s*"/gm) ?? []).length; // "What I owned" areas (the only entries with `body:`)
const expectedDecisions = (contentSrc.match(/^\s*chose:\s*"/gm) ?? []).length; // decision cards (the only entries with `chose:`)
// Payments counts come from the `payments: {` ... `},` block alone (a top-level key of the study object, indented
// two spaces), so `state:`, `text:` and the arrays are never confused with later sections.
const paymentsSrc = /^  payments:\s*\{([\s\S]*?)^  \},/m.exec(contentSrc)?.[1] ?? "";
const stringLiterals = (src) => (src.match(/"(?:[^"\\]|\\.)*"/g) ?? []).length;
const expectedStates = (paymentsSrc.match(/^\s*\{?\s*state:\s*"/gm) ?? []).length; // payment states (the only entries with `state:`)
const expectedPanels = (paymentsSrc.match(/^\s*text:\s*"/gm) ?? []).length; // reliability panels (the only entries with `text:`)
const expectedFlow = stringLiterals(/\bflow:\s*\[([\s\S]*?)\]/.exec(paymentsSrc)?.[1] ?? ""); // payments flow paragraphs
const contentTransitions = stringLiterals(/\btransitions:\s*\[([\s\S]*?)\]/.exec(paymentsSrc)?.[1] ?? ""); // transition labels
const hasPayments = expectedStates > 0;
// Testing counts come from the `testing: {` ... `},` block alone: one `value:` per count tile and the string
// literals of `paragraphs: [...]`. The as-of date stays ISO in content and is formatted at render.
const testingSrc = /^  testing:\s*\{([\s\S]*?)^  \},/m.exec(contentSrc)?.[1] ?? "";
const literal = (s) => { try { return JSON.parse(s); } catch { return s.slice(1, -1); } };
const expectedTileValues = [...testingSrc.matchAll(/\bvalue:\s*("(?:[^"\\]|\\.)*")/g)].map((m) => literal(m[1])); // count tiles (the only entries with `value:`)
const expectedTiles = expectedTileValues.length;
const expectedTestingParagraphs = (/\bparagraphs:\s*\[([\s\S]*?)\]/.exec(testingSrc)?.[1] ?? "").match(/"(?:[^"\\]|\\.)*"/g)?.map(literal) ?? [];
const countsAsOf = /\bcountsAsOf:\s*"([^"]*)"/.exec(testingSrc)?.[1] ?? "";
const hasTesting = expectedTiles > 0;
check((contentSrc.match(/\bvalue:\s*"/g) ?? []).length === expectedTiles, "`value:` must only appear inside the testing block of the content module (the gate counts it as a tile)");
check(!hasTesting || expectedTestingParagraphs.length > 0, "content module has testing tiles but no paragraphs");
// The section is a row of four tiles and three paragraphs today (spec 2.4); a dropped tile must fail by name.
check(!hasTesting || expectedTiles === 4, `the Testing section lists four count tiles; content module has ${expectedTiles}`);
check(!hasTesting || expectedTestingParagraphs.length === 3, `the Testing section has three paragraphs; content module has ${expectedTestingParagraphs.length}`);
// Assistant counts come from the `assistant: {` ... `},` block alone: one `title:` and one `text:` per safeguard
// panel (`text:` is shared with the reliability panels, so the block scope matters) plus the intro and closing.
const assistantSrc = /^  assistant:\s*\{([\s\S]*?)^  \},/m.exec(contentSrc)?.[1] ?? "";
const expectedSafeguardTitles = [...assistantSrc.matchAll(/\btitle:\s*("(?:[^"\\]|\\.)*")/g)].map((m) => literal(m[1]));
const expectedSafeguardTexts = [...assistantSrc.matchAll(/\btext:\s*("(?:[^"\\]|\\.)*")/g)].map((m) => literal(m[1]));
const expectedSafeguards = expectedSafeguardTexts.length;
const expectedAssistantIntro = literal(/\bintro:\s*("(?:[^"\\]|\\.)*")/.exec(assistantSrc)?.[1] ?? '""');
const expectedAssistantClosing = literal(/\bclosing:\s*("(?:[^"\\]|\\.)*")/.exec(assistantSrc)?.[1] ?? '""');
const hasAssistant = expectedSafeguards > 0;
check(!hasAssistant || expectedSafeguardTitles.length === expectedSafeguards, `content module assistant block has ${expectedSafeguardTitles.length} titles for ${expectedSafeguards} safeguard texts`);
check(!hasAssistant || (expectedAssistantIntro.length > 0 && expectedAssistantClosing.length > 0), "content module has assistant safeguards but no intro or closing paragraph");
// The section is five safeguard panels today (spec 2.5); a dropped panel must fail by name.
check(!hasAssistant || expectedSafeguards === 5, `the Admin AI assistant section lists five safeguard panels; content module has ${expectedSafeguards}`);
check(!hasPayments || contentTransitions === expectedStates - 1, `content module should give ${expectedStates - 1} transition labels (states - 1), found ${contentTransitions}`);
check(expectedOwned > 0, "content module defines no owned areas (no `body:` entries)");
check(!hasPayments || (expectedPanels > 0 && expectedFlow > 0), "content module has payment states but no reliability panels or flow paragraphs");

// Page structure
const html = read(join(workDir, "simply-happy.html")) ?? "";
const h1s = html.match(/<h1\b/g) ?? [];
check(h1s.length === 1, "case study must have exactly one <h1>");
const firstH1 = html.search(/<h1\b/);
const firstH2 = html.search(/<h2\b/);
check(firstH1 !== -1 && firstH2 > firstH1, "the first <h2> must come after the single <h1>");
// 2 summary panels (Before, After) + the "What I owned" areas + one reliability panel each + one title per decision card
// + one assistant safeguard panel each.
const expectedH3s = 2 + expectedOwned + expectedPanels + expectedDecisions + expectedSafeguards;
const h3Count = (html.match(/<h3\b/g) ?? []).length;
check(h3Count === expectedH3s, `expected exactly ${expectedH3s} <h3> (2 summary + ${expectedOwned} owned + ${expectedPanels} reliability + ${expectedDecisions} decisions + ${expectedSafeguards} safeguards), found ${h3Count}`);
check(html.includes('id="summary"'), 'missing <section id="summary">');
check(html.includes('id="owned"'), 'missing <section id="owned">');
check(html.includes('<main id="main"'), "root layout <main id=\"main\"> must wrap the page");
check(html.includes('id="contact"'), "contact footer (#contact) must be on the page for the nav link");
// Every aria-labelledby must point at a real id, or the section has no accessible name.
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, ref] of html.matchAll(/\saria-labelledby="([^"]+)"/g)) {
  for (const id of ref.split(/\s+/)) check(ids.has(id), `aria-labelledby="${id}" does not resolve to any id on the page`);
}

const stackList = /<ul\b[^>]*aria-label="Technologies used"[^>]*>([\s\S]*?)<\/ul>/.exec(html)?.[1] ?? "";
check((stackList.match(/<li\b/g) ?? []).length === 6, "stack list should hold 6 chips");

const summaryStart = html.indexOf('id="summary"');
const ownedStart = html.indexOf('id="owned"');
const summary = summaryStart !== -1 && ownedStart > summaryStart ? html.slice(summaryStart, ownedStart) : "";
const live = /<a\b[^>]*target="_blank"[^>]*>([\s\S]*?)<\/a>/.exec(summary);
check(!!live, "summary must contain the live-site link opening in a new tab");
if (live) {
  check(/rel="noopener noreferrer"/.test(live[0]), 'live-site link needs rel="noopener noreferrer"');
  check(live[1].includes("(opens in a new tab)"), 'live-site link needs the "(opens in a new tab)" hint');
}

// Heading order: h1, Summary, What I owned, The booking and payments flow, Decisions, Testing and delivery, Admin AI
// assistant (each only when the content has any), Screenshots, then the contact footer. The content order is now
// complete: 2.7 adds the contents list and 2.9 rewires home, neither adds a section.
const h2s = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
const expectedH2s = [
  "Summary",
  "What I owned",
  ...(hasPayments ? ["The booking and payments flow"] : []),
  ...(expectedDecisions > 0 ? ["Decisions and rejected alternatives"] : []),
  ...(hasTesting ? ["Testing and delivery"] : []),
  ...(hasAssistant ? ["Admin AI assistant (safety design)"] : []),
  "Screenshots (test data)",
];
check(
  h2s.length === expectedH2s.length + 1 && expectedH2s.every((t, i) => h2s[i] === t),
  `h2 order should be ${expectedH2s.join(" > ")} > contact, found: ${h2s.join(" > ") || "none"}`,
);

// Payments (Story 2.2). Four paragraphs, a <figure> holding the state diagram as one ordered list (states and
// transitions interleaved, transitions = states - 1) named by its figcaption, and one CaseStudyPanel (<h3>) per
// reliability entry; the section sits between #owned and #decisions. With no payments content it must be absent.
const paymentsStart = html.indexOf('id="payments"');
const paymentsClose = paymentsStart !== -1 ? html.indexOf("</section>", paymentsStart) : -1;
const paymentsHtml = paymentsStart !== -1 ? html.slice(paymentsStart, paymentsClose === -1 ? html.length : paymentsClose) : "";
if (!hasPayments) {
  check(paymentsStart === -1, "content module has no payment states, so <section id=\"payments\"> must not render");
} else {
  check(paymentsStart !== -1, 'missing <section id="payments">');
  check(ownedStart !== -1 && paymentsStart > ownedStart, "#payments must come after #owned");
  const decisionsAt = html.indexOf('id="decisions"');
  check(decisionsAt === -1 || decisionsAt > paymentsStart, "#payments must come before #decisions");
  const screenshotsAt = html.indexOf('id="screenshots"');
  check(screenshotsAt === -1 || screenshotsAt > paymentsStart, "#payments must come before #screenshots");
  check(/<h2\b[^>]*>\s*The booking and payments flow\s*<\/h2>/.test(paymentsHtml), '#payments h2 must read exactly "The booking and payments flow"');
  check(!/<article\b/.test(paymentsHtml), "#payments must not contain <article> (articles are decision cards)");
  const figureAt = paymentsHtml.indexOf("<figure");
  check(figureAt !== -1, "#payments must contain the state-diagram <figure>");
  check((paymentsHtml.match(/<figure\b/g) ?? []).length === 1, "#payments must hold exactly one <figure>");
  check((paymentsHtml.slice(0, figureAt === -1 ? undefined : figureAt).match(/<p\b/g) ?? []).length === expectedFlow, `#payments should hold ${expectedFlow} flow paragraphs (<p>) before the diagram`);
  const figure = /<figure\b[\s\S]*?<\/figure>/.exec(paymentsHtml)?.[0] ?? "";
  const labelledBy = /<figure\b[^>]*aria-labelledby="([^"]+)"/.exec(figure)?.[1];
  check(!!labelledBy && new RegExp(`<figcaption\\b[^>]*\\sid="${labelledBy}"`).test(figure), "#payments figure must be named by its figcaption");
  check(/<ol\b[^>]*role="list"/.test(figure), '#payments diagram must be an <ol role="list">');
  check(!/<(?:img|svg|picture|canvas)\b/.test(figure), "#payments diagram must be real text, not an image or SVG");
  const items = figure.match(/<li\b/g) ?? [];
  const expectedTransitions = expectedStates - 1;
  check(items.length === expectedStates + expectedTransitions, `#payments diagram should list ${expectedStates} states and ${expectedTransitions} transitions (${expectedStates + expectedTransitions} <li>), found ${items.length}`);
  // The pills carry the raised surface; the labels between them carry an aria-hidden connector glyph.
  check((figure.match(/<li\b[^>]*bg-surface-raised/g) ?? []).length === expectedStates, `#payments diagram should hold ${expectedStates} state pills`);
  check((figure.match(/aria-hidden="true"/g) ?? []).length === expectedTransitions, `#payments diagram should hold ${expectedTransitions} aria-hidden connector glyphs, one per transition`);
  // Every transition item must carry a visible label once the glyph is removed; an undefined label renders an empty span.
  const transitionItems = [...figure.matchAll(/<li\b(?![^>]*bg-surface-raised)[^>]*>([\s\S]*?)<\/li>/g)].map((m) =>
    decode(m[1].replace(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ")).trim(),
  );
  check(transitionItems.length === expectedTransitions, `#payments diagram should hold ${expectedTransitions} transition items, found ${transitionItems.length}`);
  transitionItems.forEach((label, i) => check(label.length > 0, `#payments diagram transition ${i + 1} has no label text`));
  const pills = [...figure.matchAll(/<li\b[^>]*bg-surface-raised[^>]*>\s*<span\b[^>]*>([\s\S]*?)<\/span>/g)].map((m) => decode(m[1]).trim());
  check(pills[0] === "Pending" && pills[pills.length - 1] === "Confirmed", `#payments diagram must run from Pending to Confirmed, found: ${pills.join(" > ") || "none"}`);
  // Panels: one <h3> per reliability entry, under an eyebrow that is not a heading, in a grid that stacks first.
  check((paymentsHtml.match(/<h3\b/g) ?? []).length === expectedPanels, `#payments should hold exactly ${expectedPanels} <h3>, one per reliability panel`);
  check(/<p\b[^>]*>\s*Reliability decisions\s*<\/p>/.test(paymentsHtml), '#payments needs the "Reliability decisions" eyebrow as a <p>, not a heading');
  const grid = /<ul\b[^>]*role="list"[^>]*class="([^"]*)"/.exec(paymentsHtml)?.[1] ?? "";
  check(/\bgrid-cols-1\b/.test(grid) && /\bmd:grid-cols-2\b/.test(grid), "#payments panel grid must be grid-cols-1 md:grid-cols-2");
  // Honesty and confidentiality: "a daily job" and the verified 30-day threshold; no time of day or schedule, no
  // currency, URL, path, file name or link, and stays are never described as webhook-only.
  const text = decode(paymentsHtml.replace(/<[^>]+>/g, " "));
  check(/\bdaily job\b/.test(text), '#payments must say the balance is charged by "a daily job"');
  check(/\b30 days\b/.test(text), '#payments must state the verified "30 days" threshold');
  check(!/\b\d{1,2}:\d{2}\b/.test(text) && !/\b\d{1,2}\s?(?:am|pm)\b/i.test(text) && !/\b(?:o'clock|UTC|GMT|midnight|noon)\b/i.test(text), "#payments must not give a time of day (the cron schedule is not in the repo)");
  check(!/\b(?:every|each)\s+(?:morning|night|evening|hour)\b/i.test(text) && !/\b(?:nightly|overnight|hourly|weekly)\b/i.test(text) && !/\bcron\b/i.test(text), "#payments must not describe a schedule beyond \"a daily job\"");
  check(!/[£$€]/.test(text) && !/\b(?:GBP|EUR|USD)\b/.test(text) && !/\b(?:pounds?|pence|dollars?|euros?|cents?)\b/i.test(text), "#payments must not mention prices or currency");
  check(!/https?:\/\//i.test(text) && !/\bwww\./i.test(text), "#payments must not contain a URL");
  check(!/\b[a-z0-9-]+\.(?:com|co\.uk|io|app|dev|net|org)\b/i.test(text), "#payments must not name a domain");
  check(!/\b(?:src|apps|packages|supabase|lib|app|components)\//.test(text) && !/\.(?:tsx?|jsx?|json|svelte|sql|md)\b/.test(text), "#payments must not name a file path or file name");
  check(!/<a\b/.test(paymentsHtml), "#payments must not link anywhere");
  check(!/webhook[\s-]only\b/i.test(text) && !/\bonly (?:the|by the) webhook\b/i.test(text), "#payments must not call the stays flow webhook-only (the success page is a second idempotent path)");
  check(/\bidempotent\b/i.test(text) && /\bsweep/i.test(text), "#payments must name both the idempotent webhook and the recovery sweep");
  check(!/\b(?:bg|text|border)-success\b/.test(paymentsHtml), "#payments must not use the success colour");
}

// Decisions (Story 2.3). One <article> per decision, each with both column labels; the section sits between
// #owned and #screenshots. With no decisions in the content module the section must be absent.
const decisionsStart = html.indexOf('id="decisions"');
if (expectedDecisions === 0) {
  check(decisionsStart === -1, "content module has no decisions, so <section id=\"decisions\"> must not render");
} else {
  check(decisionsStart !== -1, 'missing <section id="decisions">');
  const screenshotsAt = html.indexOf('id="screenshots"');
  check(ownedStart !== -1 && decisionsStart > ownedStart, "#decisions must come after #owned");
  check(paymentsStart === -1 || decisionsStart > paymentsStart, "#decisions must come after #payments");
  check(screenshotsAt === -1 || screenshotsAt > decisionsStart, "#decisions must come before #screenshots");
  // The slice ends at the section's own closing tag, so a missing #screenshots never pulls the footer in.
  const sectionClose = decisionsStart !== -1 ? html.indexOf("</section>", decisionsStart) : -1;
  const decisions = decisionsStart !== -1 ? html.slice(decisionsStart, sectionClose === -1 ? html.length : sectionClose) : "";
  check(expectedDecisions >= 4, `the case study needs at least four decision cards; content module has ${expectedDecisions}`);
  const cards = decisions.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
  check(cards.length === expectedDecisions, `expected ${expectedDecisions} decision cards (<article>) inside #decisions, found ${cards.length}`);
  // Later stories that add <article> elsewhere update this.
  check((html.match(/<article\b/g) ?? []).length === cards.length, "every <article> on the page must sit inside #decisions");
  cards.forEach((card, i) => {
    check(/<h3\b/.test(card), `decision card ${i + 1} needs an <h3> title`);
    check(/>\s*Chose\s*</.test(card), `decision card ${i + 1} is missing the "Chose" label`);
    check(/>\s*Rejected, because\s*</.test(card), `decision card ${i + 1} is missing the "Rejected, because" label`);
  });
  check((decisions.match(/Rejected, because/g) ?? []).length === expectedDecisions, `"Rejected, because" should appear exactly ${expectedDecisions} times inside #decisions`);
  check((decisions.match(/<h3\b/g) ?? []).length === expectedDecisions, `#decisions should hold exactly ${expectedDecisions} <h3>, one per card`);
  // Honesty and confidentiality: no per-admin daily limit claim, no URLs, no repo paths or file names in the cards.
  const text = decode(decisions.replace(/<[^>]+>/g, " "));
  check(!/daily limit/i.test(text), '#decisions must not claim a per-admin "daily limit"');
  check(!/https?:\/\//i.test(text), "#decisions must not contain a URL");
  check(!/\b(?:src|apps|packages|supabase|lib|app|components)\//.test(text) && !/\.(?:tsx?|jsx?|json|svelte|sql|md)\b/.test(text), "#decisions must not name a file path or file name");
  check(!/<a\b/.test(decisions), "#decisions must not link anywhere (no links to the private repo)");
  // The three assistant facts #assistant repeats, so the two sections cannot drift apart.
  check(/\bseven\b/i.test(text), '#decisions must say "seven" lookups (the count #assistant repeats)');
  check(/\bbrowser tab\b/i.test(text), '#decisions must say chats live in the "browser tab" (as #assistant does)');
  check(/\bwrong join\b/i.test(text), '#decisions must give the "wrong join" reason for rejecting SQL (as #assistant does)');
}

// Testing (Story 2.4). One <dl> of count tiles (a <dt> label and a <dd> value each, an optional detail <dd>)
// under one "approx., as of" <p>, then the paragraphs; the section sits between #decisions and #screenshots.
// With no testing content it must be absent.
const testingStart = html.indexOf('id="testing"');
if (!hasTesting) {
  check(testingStart === -1, "content module has no testing counts, so <section id=\"testing\"> must not render");
} else {
  check(testingStart !== -1, 'missing <section id="testing">');
  const testingClose = testingStart !== -1 ? html.indexOf("</section>", testingStart) : -1;
  const testingHtml = testingStart !== -1 ? html.slice(testingStart, testingClose === -1 ? html.length : testingClose) : "";
  check(decisionsStart === -1 || testingStart > decisionsStart, "#testing must come after #decisions");
  check(paymentsStart === -1 || testingStart > paymentsStart, "#testing must come after #payments");
  const screenshotsAt = html.indexOf('id="screenshots"');
  check(screenshotsAt === -1 || screenshotsAt > testingStart, "#testing must come before #screenshots");
  check(/<h2\b[^>]*>\s*Testing and delivery\s*<\/h2>/.test(testingHtml), '#testing h2 must read exactly "Testing and delivery"');
  check(!/<article\b/.test(testingHtml), "#testing must not contain <article> (articles are decision cards)");
  check(!/<h3\b/.test(testingHtml), "#testing must not contain <h3> (h3s are panels; tiles are dt/dd)");
  check(!/<a\b/.test(testingHtml), "#testing must not link anywhere");
  // The tiles: exactly one <dl>, one <dt> per tile, a value <dd> each plus at most one detail <dd>, real text only.
  check((testingHtml.match(/<dl\b/g) ?? []).length === 1, "#testing must hold exactly one <dl> of count tiles");
  const dl = /<dl\b[^>]*>[\s\S]*?<\/dl>/.exec(testingHtml)?.[0] ?? "";
  const dts = (dl.match(/<dt\b/g) ?? []).length;
  const dds = (dl.match(/<dd\b/g) ?? []).length;
  check(dts === expectedTiles, `#testing should hold ${expectedTiles} count tiles (<dt>) from the content module, found ${dts}`);
  check(dds >= expectedTiles && dds <= expectedTiles * 2, `#testing should hold between ${expectedTiles} and ${expectedTiles * 2} <dd> (a value each, an optional detail), found ${dds}`);
  check(!/<(?:img|svg|picture|canvas)\b/.test(dl), "#testing tiles must be real text, not images");
  check(!/<dd\b[^>]*>\s*<\/dd>/.test(dl) && !/<dt\b[^>]*>\s*<\/dt>/.test(dl), "#testing must not render an empty <dt> or <dd>");
  const dlClass = /<dl\b[^>]*class="([^"]*)"/.exec(testingHtml)?.[1] ?? "";
  check(/\bgrid-cols-2\b/.test(dlClass) && /\bmd:grid-cols-4\b/.test(dlClass), "#testing tile grid must be grid-cols-2 md:grid-cols-4");
  // The slice starts inside the opening <section> tag, so drop its remaining attributes before reading the text.
  const text = decode(testingHtml.slice(testingHtml.indexOf(">") + 1).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  const ddTexts = [...dl.matchAll(/<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
  for (const value of expectedTileValues) check(ddTexts.includes(value), `#testing tile value "${value}" from the content module is not the full text of any <dd> in the list`);
  // One as-of label, as a <p>, carrying the content date formatted "D Mon YYYY" (the ISO form never leaks through).
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const asOfMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(countsAsOf);
  check(!!asOfMatch, `content module countsAsOf must be an ISO date (YYYY-MM-DD), found "${countsAsOf}"`);
  const asOfLabel = asOfMatch ? `approx., as of ${Number(asOfMatch[3])} ${months[Number(asOfMatch[2]) - 1]} ${asOfMatch[1]}` : "";
  const asOfPs = [...testingHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim()).filter((t) => t.startsWith("approx."));
  check(asOfPs.length === 1 && asOfPs[0] === asOfLabel, `#testing needs the as-of label "${asOfLabel}" exactly once as a <p>, found: ${asOfPs.join(" | ") || "none"}`);
  check((text.match(/approx\., as of/g) ?? []).length === 1, '#testing must carry "approx., as of" exactly once');
  check(!countsAsOf || !text.includes(countsAsOf), "#testing must format the as-of date, never print the ISO string");
  check(/\bapprox\./.test(text), '#testing text must say "approx."');
  // Paragraphs: one <p> per content paragraph after the list, each present verbatim.
  const dlEnd = testingHtml.indexOf("</dl>");
  const afterList = dlEnd === -1 ? "" : testingHtml.slice(dlEnd);
  const paragraphs = (afterList.match(/<p\b/g) ?? []).length;
  check(paragraphs === expectedTestingParagraphs.length, `#testing should hold ${expectedTestingParagraphs.length} paragraphs (<p>) after the tiles, found ${paragraphs}`);
  for (const [i, p] of expectedTestingParagraphs.entries()) check(text.includes(p.replace(/\s+/g, " ")), `#testing paragraph ${i + 1} from the content module is missing from the page`);
  // Honesty: counts stay approximate; CI runs only on pull requests (never "every commit" or "on push"); the
  // Playwright integration tests are the CI suite; Storybook appears in the prose only alongside "local"; no
  // visual snapshots, tool versions, URLs, paths, file names, domains or links.
  check(/\bPlaywright\b[^.]*\bCI\b|\bCI\b[^.]*\bPlaywright\b/.test(text), "#testing must say the Playwright integration tests run in CI");
  check(/\bCI\b[^.]*\bpull requests?\b/.test(text), "#testing must say CI runs on pull requests");
  check(!/\b(?:every|each)\s+(?:commit|push)\b/i.test(text) && !/\bon\s+(?:every\s+|each\s+)?push\b/i.test(text), '#testing must not claim CI runs on "every commit" or "on push"');
  check(/\bStorybook test runner\b[^.]*\blocal/i.test(text), '#testing must say the Storybook test runner runs locally');
  const proseSentences = [...afterList.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].flatMap((m) => decode(m[1].replace(/<[^>]+>/g, " ")).split(/(?<=[.;:])\s+/));
  for (const sentence of proseSentences) {
    if (/\bStorybook\b/.test(sentence)) check(/\blocal/i.test(sentence), `#testing names Storybook without "local" in the same sentence: "${sentence.trim()}"`);
  }
  check(!/\bsnapshots?\b/i.test(text), "#testing must not mention snapshots (visual snapshots are not wired)");
  check(!/\bv\d+\.\d+\b/.test(text) && !/\b\d+\.\d+\.\d+\b/.test(text), "#testing must not give a tool version number");
  check(!/\b[a-z]{2,5}-\d{2,4}\b/i.test(text), "#testing must not contain an issue key");
  check(!/\b(?:asjir|simply-happy-web|makhan)/i.test(text), "#testing must not name the repository or a username");
  check(!/https?:\/\//i.test(text) && !/\bwww\./i.test(text), "#testing must not contain a URL");
  check(!/\b[a-z0-9-]+\.(?:com|co\.uk|io|app|dev|net|org|yml|yaml)\b/i.test(text), "#testing must not name a domain or a config file");
  check(!/\b(?:src|apps|packages|supabase|lib|app|components|tests|\.github|\.githooks)\//.test(text) && !/\.(?:tsx?|jsx?|json|svelte|sql|md|mjs|sh)\b/.test(text), "#testing must not name a file path or file name");
  check(!/\b(?:bg|text|border)-success\b/.test(testingHtml), "#testing must not use the success colour");
  // text-muted is for the as-of label and the tile detail lines only.
  const muted = [...testingHtml.matchAll(/<(\w+)\b[^>]*class="[^"]*\btext-text-muted\b[^"]*"/g)].map((m) => m[1]);
  check(muted.every((tag) => tag === "p" || tag === "dd") && muted.filter((t) => t === "p").length === 1, `#testing text-muted is for the as-of <p> and detail <dd> only, found on: ${muted.join(", ") || "none"}`);
}

// Assistant (Story 2.5). One intro <p>, one <ul role="list"> of CaseStudyPanel tiles (an <h3> each, one per
// safeguard in the content module) and one closing <p>; the section sits between #testing and #screenshots.
// With no assistant content it must be absent.
const assistantStart = html.indexOf('id="assistant"');
if (!hasAssistant) {
  check(assistantStart === -1, "content module has no assistant safeguards, so <section id=\"assistant\"> must not render");
} else {
  check(assistantStart !== -1, 'missing <section id="assistant">');
  const assistantClose = assistantStart !== -1 ? html.indexOf("</section>", assistantStart) : -1;
  const assistantHtml = assistantStart !== -1 ? html.slice(assistantStart, assistantClose === -1 ? html.length : assistantClose) : "";
  check(testingStart === -1 || assistantStart > testingStart, "#assistant must come after #testing");
  check(decisionsStart === -1 || assistantStart > decisionsStart, "#assistant must come after #decisions");
  check(paymentsStart === -1 || assistantStart > paymentsStart, "#assistant must come after #payments");
  const screenshotsAt = html.indexOf('id="screenshots"');
  check(screenshotsAt === -1 || screenshotsAt > assistantStart, "#assistant must come before #screenshots");
  check(/<h2\b[^>]*>\s*Admin AI assistant \(safety design\)\s*<\/h2>/.test(assistantHtml), '#assistant h2 must read exactly "Admin AI assistant (safety design)"');
  check(!/<article\b/.test(assistantHtml), "#assistant must not contain <article> (articles are decision cards)");
  check(!/<a\b/.test(assistantHtml), "#assistant must not link anywhere");
  // Panels: one list, one <li> and one <h3> per safeguard, each <h3> reading its content title, in a grid that stacks first.
  check((assistantHtml.match(/<ul\b/g) ?? []).length === 1 && /<ul\b[^>]*role="list"/.test(assistantHtml), '#assistant must hold exactly one <ul role="list"> of safeguard panels');
  const ulStart = assistantHtml.indexOf("<ul");
  const ulEnd = assistantHtml.indexOf("</ul>");
  const list = ulStart === -1 || ulEnd === -1 ? "" : assistantHtml.slice(ulStart, ulEnd);
  const items = (list.match(/<li\b/g) ?? []).length;
  check(items === expectedSafeguards, `#assistant should hold ${expectedSafeguards} safeguard panels (<li>) from the content module, found ${items}`);
  check((assistantHtml.match(/<h3\b/g) ?? []).length === expectedSafeguards, `#assistant should hold exactly ${expectedSafeguards} <h3>, one per safeguard panel`);
  const h3Texts = [...list.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
  check(JSON.stringify(h3Texts) === JSON.stringify(expectedSafeguardTitles), `#assistant panel headings should read ${expectedSafeguardTitles.join(" | ")}, found: ${h3Texts.join(" | ") || "none"}`);
  const grid = /<ul\b[^>]*role="list"[^>]*class="([^"]*)"/.exec(assistantHtml)?.[1] ?? "";
  check(/\bgrid-cols-1\b/.test(grid) && /\bmd:grid-cols-2\b/.test(grid), "#assistant panel grid must be grid-cols-1 md:grid-cols-2");
  // One intro <p> between the h2 and the list and one closing <p> after it; the panels' own <p> bodies sit inside the list.
  const beforeList = ulStart === -1 ? assistantHtml : assistantHtml.slice(0, ulStart);
  const afterList = ulEnd === -1 ? "" : assistantHtml.slice(ulEnd);
  check((beforeList.match(/<p\b/g) ?? []).length === 1, `#assistant should hold exactly one intro <p> before the panel list, found ${(beforeList.match(/<p\b/g) ?? []).length}`);
  check((afterList.match(/<p\b/g) ?? []).length === 1, `#assistant should hold exactly one closing <p> after the panel list, found ${(afterList.match(/<p\b/g) ?? []).length}`);
  // The slice starts inside the opening <section> tag, so drop its remaining attributes before reading the text.
  const text = decode(assistantHtml.slice(assistantHtml.indexOf(">") + 1).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  check(text.includes(expectedAssistantIntro.replace(/\s+/g, " ")), "#assistant intro paragraph from the content module is missing from the page");
  check(text.includes(expectedAssistantClosing.replace(/\s+/g, " ")), "#assistant closing paragraph from the content module is missing from the page");
  for (const [i, t] of expectedSafeguardTexts.entries()) check(text.includes(t.replace(/\s+/g, " ")), `#assistant safeguard ${i + 1} text from the content module is missing from the page`);
  // Honesty: the verified facts by name, in the words the decision cards use (seven lookups, browser-tab chats, the
  // "wrong join" reason); no vendor, model or product name, amount, currency, per-admin "daily limit", URL, path,
  // file name, domain or link.
  check(/\bseven\b/i.test(text), '#assistant must say "seven" lookups (the verified count, as the decision cards do)');
  check(/\bread-only\b/i.test(text), '#assistant must say "read-only"');
  check(/\btest\b/i.test(text), '#assistant must name the "test" that enforces the excluded fields');
  check(/\boff switch\b/i.test(text), '#assistant must name the admin "off switch"');
  check(/\blaunched\b/i.test(text), '#assistant must describe the assistant as "launched"');
  check(/\bbrowser tab\b/i.test(text), '#assistant must say chats live in the "browser tab" (as the decision card does)');
  check(/\bwrong join\b/i.test(text), '#assistant must give the "wrong join" reason for rejecting SQL (as the decision card does)');
  check(/\ballergies\b/i.test(text) && /\bdate of birth\b/i.test(text) && /\bgender\b/i.test(text) && /\btax number\b/i.test(text), "#assistant must name the excluded fields: allergies, date of birth, gender and tax number");
  check(/\bmonthly\b/i.test(text), "#assistant must describe the spend cap as monthly");
  check(!/\b(?:Anthropic|Claude|OpenAI|GPT|Console|Gemini|Mistral|Llama|Sonnet|Opus|Haiku|Stripe|Supabase|Svelte|SvelteKit|tRPC|Postgres|PostgreSQL|Drizzle|Resend|AWS|TOConline)\b/i.test(text), "#assistant must not name a vendor, model or product (no Anthropic, Claude, OpenAI, GPT or Console, and none of the stack's vendors)");
  check(!/[£$€]/.test(text) && !/\b(?:GBP|EUR|USD)\b/.test(text) && !/\b(?:pounds?|pence|dollars?|euros?|cents?)\b/i.test(text), "#assistant must not mention an amount or currency");
  check(!/\d/.test(text), "#assistant must not contain a figure (the spend cap has no amount; counts are written out)");
  check(!/\bdaily limit\b/i.test(text) && !/\bper[\s-]admin\b[^.]*\blimit\b/i.test(text) && !/\bdaily\b/i.test(text), '#assistant must not claim a per-admin "daily limit" (none exists)');
  check(!/https?:\/\//i.test(text) && !/\bwww\./i.test(text), "#assistant must not contain a URL");
  check(!/\b[a-z0-9-]+\.(?:com|co\.uk|io|app|dev|net|org)\b/i.test(text), "#assistant must not name a domain");
  check(!/\b(?:src|apps|packages|supabase|lib|app|components)\//.test(text) && !/\.(?:tsx?|jsx?|json|svelte|sql|md)\b/.test(text), "#assistant must not name a file path or file name");
  check(!/\b[A-Za-z0-9]+_[A-Za-z0-9_]+\b/.test(text), "#assistant must not name a code identifier (snake_case table, column or lookup name)");
  check(!/\b(?:bg|text|border)-success\b/.test(assistantHtml), "#assistant must not use the success colour");
  check(!/\btext-text-muted\b/.test(assistantHtml), "#assistant must not use text-muted (it is for captions and metadata)");
}

// Contents (Story 2.7). Two <nav aria-label="Contents"> between the <h1> and #summary: the lg:hidden one holds a
// closed <details> whose <summary> reads "Contents", the hidden lg:block lg:sticky one is the desktop column. Both
// list one plain anchor per <section id> on the page, in source order, so a section dropped from the content module
// drops its link too. Every target section takes focus (tabindex="-1") and the server HTML marks nothing current.
const contentsLabels = {
  summary: "Summary",
  owned: "What I owned",
  payments: "Booking and payments",
  decisions: "Decisions",
  testing: "Testing and delivery",
  assistant: "Admin AI assistant",
  screenshots: "Screenshots",
};
const sectionTags = html.match(/<section\b[^>]*>/g) ?? [];
const sectionIds = sectionTags.map((tag) => /\sid="([^"]+)"/.exec(tag)?.[1]).filter(Boolean);
check(sectionIds.length === sectionTags.length, "every <section> on the case study needs an id for the contents list to link to");
for (const id of sectionIds) check(Object.hasOwn(contentsLabels, id), `<section id="${id}"> has no contents label in check-case-study's label map`);
for (const tag of sectionTags) {
  check(/\stabindex="-1"/.test(tag), `every contents target must take focus (tabindex="-1"): ${tag.slice(0, 120)}`);
  // A jump lands the section 112px down, clear of the floating nav's bottom edge (about 102px).
  check(/\sclass="[^"]*(?<=["\s])scroll-mt-28(?=[\s"])/.test(tag), `every contents target must land clear of the floating nav (scroll-mt-28): ${tag.slice(0, 120)}`);
}
const expectedContents = sectionIds.map((id) => ({ id, label: contentsLabels[id] }));
const tocNavs = [...html.matchAll(/<nav\b[^>]*\saria-label="Contents"[^>]*>[\s\S]*?<\/nav>/g)].map((m) => ({ html: m[0], at: m.index, end: m.index + m[0].length }));
check(tocNavs.length === 2, `expected two <nav aria-label="Contents"> (the disclosure and the sticky column), found ${tocNavs.length}`);
const navClasses = (nav) => new Set((/^<nav\b[^>]*\sclass="([^"]*)"/.exec(nav.html)?.[1] ?? "").split(/\s+/).filter(Boolean));
const isColumn = (nav) => { const c = navClasses(nav); return c.has("hidden") && c.has("lg:block") && c.has("lg:sticky"); };
const isDisclosure = (nav) => { const c = navClasses(nav); return c.has("lg:hidden") && !c.has("hidden"); };
const columns = tocNavs.filter(isColumn);
const disclosures = tocNavs.filter(isDisclosure);
check(columns.length === 1, `exactly one contents <nav> must be the sticky column ("hidden lg:block lg:sticky"), found ${columns.length}`);
check(disclosures.length === 1, `exactly one contents <nav> must be the small-screen disclosure ("lg:hidden"), found ${disclosures.length}`);
if (disclosures.length === 1) {
  const nav = disclosures[0].html;
  const detailsTags = nav.match(/<details\b[^>]*>/g) ?? [];
  check(detailsTags.length === 1, `the contents disclosure must hold exactly one <details>, found ${detailsTags.length}`);
  check(detailsTags.every((tag) => !/\sopen(?=[\s=>])/.test(tag)), "the contents <details> must be closed in the HTML (no open attribute)");
  const summaryText = decode((/<summary\b[^>]*>([\s\S]*?)<\/summary>/.exec(nav)?.[1] ?? "").replace(/<[^>]+>/g, "")).trim();
  check(summaryText === "Contents", `the contents <summary> must read "Contents", found "${summaryText}"`);
}
if (columns.length === 1) check(/<p\b[^>]*>\s*On this page\s*<\/p>/.test(columns[0].html), 'the sticky contents column needs its "On this page" eyebrow as a <p>');
for (const nav of tocNavs) {
  const which = isColumn(nav) ? "sticky contents column" : isDisclosure(nav) ? "contents disclosure" : "contents nav";
  check(!/<h[1-6]\b/.test(nav.html), `the ${which} must not hold a heading (the h2 order stays as it is)`);
  const links = [...nav.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: /\shref="([^"]*)"/.exec(m[1])?.[1] ?? "",
    label: decode(m[2].replace(/<[^>]+>/g, "")).trim(),
  }));
  check(links.length === expectedContents.length, `the ${which} should list ${expectedContents.length} links, one per <section id>, found ${links.length}`);
  expectedContents.forEach(({ id, label }, i) => {
    check(links[i]?.href === `#${id}`, `${which} link ${i + 1} should point at "#${id}", found "${links[i]?.href ?? "none"}"`);
    check(links[i]?.label === label, `${which} link ${i + 1} label should read "${label}", found "${links[i]?.label ?? "none"}"`);
  });
}
check(!tocNavs.some((nav) => /\saria-current=/.test(nav.html)), "the contents in the server HTML must not carry aria-current (without JavaScript nothing tracks the current section)");
check(
  tocNavs.length > 0 && tocNavs.every((nav) => nav.at > firstH1 && summaryStart !== -1 && nav.end <= summaryStart),
  "the contents must come after the <h1> and before #summary",
);

// Reduced motion, as built (check-toc checks the source rule): a stylesheet the case study links must make every
// scroll instant under prefers-reduced-motion, after the last smooth-scroll rule it overrides.
const cssHrefs = [...html.matchAll(/<link\b[^>]*>/g)]
  .map((m) => m[0])
  .filter((tag) => /\srel="stylesheet"/.test(tag))
  .map((tag) => /\shref="([^"]+)"/.exec(tag)?.[1] ?? "")
  .filter((href) => href.startsWith("/_next/"));
check(cssHrefs.length > 0, "the case study links no /_next/ stylesheet");
const reduceRule = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{\s*\*\s*\{\s*scroll-behavior:\s*auto\s*!important;?\s*\}\s*\}/;
const builtReduce = cssHrefs.some((href) => {
  const css = read(join(root, ".next", href.slice("/_next/".length).split("?")[0])) ?? "";
  const smooth = [...css.matchAll(/scroll-behavior:\s*smooth\s*!important/g)].map((m) => m.index);
  const reduce = reduceRule.exec(css);
  return smooth.length > 0 && !!reduce && reduce.index > Math.max(...smooth);
});
check(builtReduce, "built CSS: a linked stylesheet needs @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important } } after the scroll-behavior: smooth !important rule");

// Screenshots (Story 2.6). The expected count follows the content module, so the gate tracks the manifest;
// one explicit check pins what the manifest lists today.
const shotEntries = [...contentSrc.matchAll(/\bsrc:\s*"(\/work\/simply-happy\/[^"]+)"([\s\S]*?)\}/g)].map((m) => ({
  src: m[1],
  width: Number(/\bwidth:\s*(\d+)/.exec(m[2])?.[1]),
  height: Number(/\bheight:\s*(\d+)/.exec(m[2])?.[1]),
}));
const srcs = shotEntries.map((e) => e.src);
check(new Set(srcs).size === srcs.length, "content module references the same screenshot twice");
const expectedShots = new Set(srcs).size;
check(expectedShots > 0, "content module references no screenshots under /work/simply-happy/");
check(expectedShots === 7, `manifest currently lists 7 screenshots; content module references ${expectedShots}`);

// Every referenced file exists under public/ and the declared intrinsic size matches the PNG header (IHDR).
const pngSize = (file) => {
  const b = readFileSync(file);
  return b.length >= 24 && b.toString("latin1", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null;
};
for (const { src, width, height } of shotEntries) {
  const file = join(root, "public", src);
  check(existsSync(file), `screenshot missing on disk: public${src}`);
  if (!existsSync(file)) continue;
  const size = pngSize(file);
  check(
    !!size && size[0] === width && size[1] === height,
    `content width/height for ${src} is ${width}x${height} but the PNG is ${size ? size.join("x") : "not a PNG"}`,
  );
}

check(html.includes('id="screenshots"'), 'missing <section id="screenshots">');
const shotsStart = html.indexOf('id="screenshots"');
const contactStart = html.indexOf('id="contact"');
const shots = shotsStart !== -1 && contactStart > shotsStart ? html.slice(shotsStart, contactStart) : "";
check(ownedStart !== -1 && shotsStart > ownedStart, "#screenshots must come after #owned");
// Every figure is either a screenshot frame inside #screenshots or the one payments diagram inside #payments.
const expectedFigures = expectedShots + (hasPayments ? 1 : 0);
const figures = html.match(/<figure\b/g) ?? [];
check(figures.length === expectedFigures, `expected exactly ${expectedFigures} <figure> on the case study (${expectedShots} screenshots${hasPayments ? " + the payments diagram" : ""}), found ${figures.length}`);
check((shots.match(/<figure\b/g) ?? []).length === expectedShots, `all ${expectedShots} screenshot figures must sit inside #screenshots`);
check(!/<h3\b/.test(shots), "no <h3> inside #screenshots unless a figure heading is added deliberately");
const allCaptions = html.match(/<figcaption\b/g) ?? [];
check(allCaptions.length === expectedFigures, `expected ${expectedFigures} <figcaption> on the page, found ${allCaptions.length}`);
const captions = [...shots.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
check(captions.length === expectedShots, `expected ${expectedShots} <figcaption> inside #screenshots, found ${captions.length}`);
for (const c of captions) check(c.startsWith("Test data"), `figcaption must start with "Test data": ${c}`);
const thumbs = shots.match(/<button\b[^>]*aria-haspopup="dialog"/g) ?? [];
check(thumbs.length === expectedShots, `expected ${expectedShots} thumbnail buttons with aria-haspopup="dialog", found ${thumbs.length}`);
const dialogs = shots.match(/<dialog\b[^>]*>/g) ?? [];
check(
  dialogs.length === expectedShots && dialogs.every((d) => /\saria-label="Larger view: Test data/.test(d)),
  `expected ${expectedShots} <dialog> in #screenshots, each with aria-label starting "Larger view: Test data", found ${dialogs.length}`,
);
// The same <img> requirements apply to every ScreenshotFrame image, on this page and on the home feature.
const checkFrameImg = (img, where) => {
  check(/\salt="[^"]+"/.test(img), `${where} <img> needs non-empty alt: ${img.slice(0, 120)}`);
  check(/\sloading="lazy"/.test(img) && !/fetchpriority="high"/i.test(img), `${where} <img> must be lazy, none is the LCP: ${img.slice(0, 120)}`);
  check(/\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img) && /\ssizes="/.test(img), `${where} <img> needs width, height and sizes: ${img.slice(0, 120)}`);
};
const shotImgs = shots.match(/<img\b[^>]*>/g) ?? [];
check(shotImgs.length === expectedShots, `expected ${expectedShots} <img> in #screenshots (dialog bodies mount only when open), found ${shotImgs.length}`);
for (const img of shotImgs) checkFrameImg(img, "screenshot");
// Next encodes the path in preload hrefs and imageSrcSet (%2Fwork%2Fsimply-happy%2F), so match both spellings.
const shotPath = /(?:\/|%2F)work(?:\/|%2F)simply-happy(?:\/|%2F)/i;
for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
  if (/\srel="preload"/.test(tag) && /\sas="image"/.test(tag)) check(!shotPath.test(tag), `no screenshot may be preloaded: ${tag.slice(0, 160)}`);
}

// Home page: the ScreenshotFrame default image branch must still render inside the Simply Happy feature.
const home = read(join(app, "index.html")) ?? "";
const workStart = home.indexOf('id="work"');
const workEnd = workStart === -1 ? -1 : home.indexOf("<section", workStart + 1);
const homeWork = workStart === -1 ? "" : home.slice(workStart, workEnd === -1 ? undefined : workEnd);
check((homeWork.match(/<figure\b/g) ?? []).length === 1, "home #work must hold exactly one <figure>");
check((homeWork.match(/<figcaption\b/g) ?? []).length === 1, "home #work must hold exactly one <figcaption>");
const homeImgs = homeWork.match(/<img\b[^>]*>/g) ?? [];
check(homeImgs.length === 1, `home #work must hold exactly one <img>, found ${homeImgs.length}`);
for (const img of homeImgs) checkFrameImg(img, "home feature");

// Home wiring (Story 2.9). The three links into the case study are internal: no target and no new-tab hint.
const anchors = (doc) =>
  [...doc.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: /\shref="([^"]*)"/.exec(m[1])?.[1],
    attrs: m[1],
    text: decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
  }));
const checkInternal = (links, where, href, label) => {
  check(links.length === 1, `${where} should hold exactly one link to ${href}, found ${links.length}`);
  for (const a of links) {
    check(a.text.startsWith(label), `${where} link should read "${label}", found "${a.text}"`);
    check(!/\starget=/.test(a.attrs), `${where} link to ${href} must open in place (no target)`);
    check(!a.text.includes("(opens in a new tab)"), `${where} link to ${href} must not carry the new-tab hint`);
  }
};
const heroStart = home.search(/<h1\b/);
const homeHero = heroStart !== -1 && workStart > heroStart ? home.slice(heroStart, workStart) : "";
check(homeHero !== "", "home: could not find the hero between the <h1> and #work");
checkInternal(anchors(homeHero).filter((a) => a.href === "/work/simply-happy"), "home hero", "/work/simply-happy", "Read the Simply Happy case study");
checkInternal(anchors(homeWork).filter((a) => a.href === "/work/simply-happy"), "home #work feature", "/work/simply-happy", "Read the case study");
checkInternal(anchors(home).filter((a) => a.href === "/work/simply-happy#assistant"), "home assistant tile", "/work/simply-happy#assistant", "Admin AI assistant");
check(ids.has("assistant"), 'the case study needs id="assistant" for the home assistant tile to land on');
const clientDomain = /\shref="[^"]*simplyhappy\.pt/i;
check(!clientDomain.test(home), "home must not link to the client's site (simplyhappy.pt); only the case study does");
const clientSite = /^https?:\/\/(?:[a-z0-9-]+\.)*simplyhappy\.pt(?:[/?#]|$)/i; // the client's domain and any subdomain
const liveLinks = anchors(html).filter((a) => clientSite.test(a.href ?? ""));
check(liveLinks.length === 1, `the case study should hold exactly one live-site link, found ${liveLinks.length}`);
// The feature image is the test-data booking screenshot (next/image encodes the path as %2F in src and srcSet).
const featureImg = homeImgs[0] ?? "";
check(/(?:\/|%2F)work(?:\/|%2F)simply-happy(?:\/|%2F)booking-rooms\.png/i.test(featureImg), `home feature <img> must be /work/simply-happy/booking-rooms.png: ${featureImg.slice(0, 160)}`);
check(
  attr(featureImg, /\salt="([^"]*)"/) === "The booking flow after dates are chosen: room categories with photo, capacity, availability and a Select button",
  "home feature <img> alt must describe the room selection step (owner inputs, section 1)",
);
check(/\swidth="2880"/.test(featureImg) && /\sheight="1800"/.test(featureImg), "home feature <img> must declare 2880x1800, the PNG's intrinsic size");
const homeCaption = decode((/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/.exec(homeWork)?.[1] ?? "").replace(/<[^>]+>/g, "")).trim();
check(homeCaption === "Test data. Room selection step of the booking flow, develop preview", `home feature caption mismatch: ${homeCaption}`);
check(!existsSync(join(root, "public", "simplyhappy-screenshot.png")), "public/simplyhappy-screenshot.png should be deleted (nothing uses it)");
// The file behind the feature image exists: next/image serves /_next/image?url=<encoded path>, so decode that path.
const featureSrc = attr(featureImg, /\ssrc="([^"]*)"/) ?? "";
let featurePath = featureSrc;
try { featurePath = decodeURIComponent(new URL(featureSrc, "http://x").searchParams.get("url") ?? featureSrc); } catch {}
check(featurePath.startsWith("/") && existsSync(join(root, "public", featurePath)), `home feature image file missing under public/: ${featurePath || "(no src)"}`);
// Links that stay plain <a> (Story 2.9): the footer CV keeps download on both pages; the CoinFlow tile opens a new tab.
for (const [name, doc] of [["home", home], ["case study", html]]) {
  const cv = anchors(doc).filter((a) => a.href === "/Muhammad-Ali-Khan-CV.pdf");
  check(cv.length === 1 && /\sdownload(?:=|\s|$)/.test(cv[0].attrs), `${name}: the footer CV link (/Muhammad-Ali-Khan-CV.pdf) needs a download attribute`);
}
const coinflow = anchors(home).filter((a) => a.href === "https://coinflow.netlify.app");
check(
  coinflow.length === 1 && /\starget="_blank"/.test(coinflow[0].attrs) && /\srel="noopener noreferrer"/.test(coinflow[0].attrs) && coinflow[0].text.includes("(opens in a new tab)"),
  'home: the CoinFlow tile needs target="_blank", rel="noopener noreferrer" and the "(opens in a new tab)" hint',
);

// Exactly the expected islands (source files only); "use client" placement itself is enforced by check-islands.
const islandsDir = join(root, "src", "components", "islands");
const islands = existsSync(islandsDir)
  ? readdirSync(islandsDir, { withFileTypes: true }).filter((e) => e.isFile() && /\.[jt]sx?$/.test(e.name)).map((e) => e.name).sort()
  : [];
const expectedIslands = ["CopyEmail.tsx", "FloatingNavbar.tsx", "ScreenshotViewer.tsx", "TocHighlight.tsx"];
check(JSON.stringify(islands) === JSON.stringify(expectedIslands), `src/components/islands should hold exactly ${expectedIslands.join(", ")}; found: ${islands.join(", ") || "none"}`);

// Metadata
const title = attr(html, /<title>([^<]*)<\/title>/);
check(title === "Simply Happy case study · Muhammad Ali Khan", `case study <title> mismatch: ${title}`);
check(attr(html, /<meta property="og:title" content="([^"]*)"/) === title, "og:title must equal the page title");
check(attr(html, /<link rel="canonical" href="([^"]*)"/) === "https://muhammadalikhan.co.uk/work/simply-happy", "canonical should be the absolute /work/simply-happy URL");
check(attr(html, /<meta property="og:url" content="([^"]*)"/) === "https://muhammadalikhan.co.uk/work/simply-happy", "og:url mismatch");
check(/property="og:image"/.test(html), "case study must carry the social image");
check(/name="twitter:image"/.test(html), "case study must carry the twitter image");
const description = attr(html, /<meta name="description" content="([^"]*)"/);
const lede = attr(html, /<h1\b[^>]*>[\s\S]*?<\/h1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/);
check(!!description && description === lede, `meta description must equal the lede\n    description: ${description}\n    lede: ${lede}`);

// Tokens only: no raw hex colours in the new source files.
const hex = /#[0-9a-f]{3,8}\b/i;
const sourceFiles = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.[jt]sx?$/.test(entry.name)) sourceFiles.push(full);
  }
};
walk(join(root, "src", "app", "work"));
walk(join(root, "src", "content", "work"));
sourceFiles.push(join(root, "src", "components", "ui", "CaseStudyPanel.tsx"));
sourceFiles.push(join(root, "src", "components", "ui", "DecisionCard.tsx"));
sourceFiles.push(join(root, "src", "components", "sections", "DecisionsSection.tsx"));
sourceFiles.push(join(root, "src", "components", "ui", "StateDiagram.tsx"));
sourceFiles.push(join(root, "src", "components", "sections", "PaymentsSection.tsx"));
sourceFiles.push(join(root, "src", "components", "sections", "TestingSection.tsx"));
sourceFiles.push(join(root, "src", "components", "sections", "AssistantSection.tsx"));
sourceFiles.push(join(root, "src", "components", "ui", "ScreenshotFrame.tsx"));
sourceFiles.push(join(root, "src", "components", "islands", "ScreenshotViewer.tsx"));
sourceFiles.push(join(root, "src", "components", "islands", "TocHighlight.tsx"));
for (const file of sourceFiles) {
  const src = read(file);
  check(src !== null, `missing source file ${relative(root, file)}`);
  if (src !== null) check(!hex.test(src), `raw hex colour in ${relative(root, file)}; use tailwind.config.ts tokens`);
}

// robots and sitemap
const robots = read(join(app, "robots.txt.body")) ?? "";
check(/User-Agent: \*/i.test(robots) && /Allow: \//.test(robots), "robots.txt must allow all");
check(robots.includes("Sitemap: https://muhammadalikhan.co.uk/sitemap.xml"), "robots.txt must point at the sitemap");
const sitemap = read(join(app, "sitemap.xml.body")) ?? "";
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length === 2 && locs.includes("https://muhammadalikhan.co.uk") && locs.includes("https://muhammadalikhan.co.uk/work/simply-happy"), `sitemap should list home and the case study, found: ${locs.join(", ") || "none"}`);
// A date-only lastmod proves the value came from content; `new Date()` would serialise with a time part.
check((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length === 2, "sitemap entries need a fixed date-only lastmod");

// Person JSON-LD, once per page
const sameAs = ["https://www.linkedin.com/in/muhammad-khan-464b80203/", "https://github.com/Maks6831"];
for (const [name, file] of [["home", join(app, "index.html")], ["case study", join(workDir, "simply-happy.html")]]) {
  const doc = read(file) ?? "";
  const scripts = doc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
  check(scripts.length === 1, `${name}: expected exactly one JSON-LD script, found ${scripts.length}`);
  if (scripts.length === 1) {
    try {
      const data = JSON.parse(scripts[0].replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""));
      check(data["@type"] === "Person" && data.name && data.jobTitle, `${name}: Person JSON-LD is missing name or jobTitle`);
      check(data.url === "https://muhammadalikhan.co.uk", `${name}: Person url mismatch`);
      check(JSON.stringify(data.sameAs) === JSON.stringify(sameAs), `${name}: Person sameAs must be exactly LinkedIn then GitHub`);
      check(data.address?.addressLocality === "London" && data.address?.addressCountry === "GB", `${name}: Person address must be London, GB`);
    } catch { failures.push(`${name}: JSON-LD does not parse`); }
  }
}

if (failures.length) {
  console.error("check:case-study FAILED:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("check:case-study passed");
