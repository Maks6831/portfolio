// Checks the pure helpers in src/lib/dates.ts (transpiled with the project's TypeScript).
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
import ts from "typescript";

const src = readFileSync(new URL("../src/lib/dates.ts", import.meta.url), "utf8");
const js = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { formatDay, formatRange, monthsBetween } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);

const now = new Date(Date.UTC(2026, 0, 15)); // Jan 2026
assert.equal(formatRange("2025-08", "present", now), "Aug 2025 – Present · 6 mos");
assert.equal(formatRange("2024-11", "2025-09", now), "Nov 2024 – Sep 2025 · 11 mos");
assert.equal(formatRange("2023", "2024", now), "2023 – 2024");
assert.equal(formatRange("2023", "present", now), "2023 – Present");
assert.equal(formatRange("2024-01", "2025-12", now), "Jan 2024 – Dec 2025 · 2 yrs");
assert.equal(formatRange("2025-01", "2025-01", now), "Jan 2025 – Jan 2025 · 1 mo");
assert.equal(monthsBetween("2023", "2024-05", now), null);
assert.equal(monthsBetween("2025-05", "2025-01", now), null);
// malformed input renders nothing instead of a wrong date
assert.equal(formatRange("", "present", now), "");
assert.equal(formatRange("Aug 2025", "present", now), "");
assert.equal(formatRange("2025-8", "present", now), "");
assert.equal(formatRange("2024-11", "2025-13", now), "");
assert.equal(formatRange("2024-11", "Presnt", now), "");
assert.equal(formatRange("2027-03", "present", now), "Mar 2027 – Present");

// formatDay (Story 2.4, the case study's "as of" label): YYYY-MM-DD -> D Mon YYYY, "" on anything malformed
assert.equal(formatDay("2026-10-18"), "18 Oct 2026");
assert.equal(formatDay("2025-12-31"), "31 Dec 2025");
assert.equal(formatDay("2026-01-01"), "1 Jan 2026");
assert.equal(formatDay("2026-10-08"), "8 Oct 2026");
assert.equal(formatDay(""), "");
assert.equal(formatDay("2026-10"), "");
assert.equal(formatDay("2026-10-8"), "");
assert.equal(formatDay("18 Oct 2026"), "");
assert.equal(formatDay("2026-13-01"), "");
assert.equal(formatDay("2026-10-32"), "");
assert.equal(formatDay("2026-02-30"), "");
assert.equal(formatDay("2024-02-29"), "29 Feb 2024");
assert.equal(formatDay("2023-02-29"), "");
assert.equal(formatDay("2026-04-31"), "");
assert.equal(formatDay("2026-10-18T00:00:00Z"), "");

// every role in the content file must parse and must not read as "Present" by accident
const site = ts.transpileModule(
  readFileSync(new URL("../src/content/site.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }
).outputText;
const { workExperience } = await import(
  "data:text/javascript;base64," + Buffer.from(site).toString("base64")
);
for (const r of workExperience) {
  const out = formatRange(r.start, r.end, now);
  assert.notEqual(out, "", `bad dates for ${r.company}: ${r.start} / ${r.end}`);
  if (r.end !== "present") assert.ok(!out.includes("Present"), `closed role reads as present: ${r.company}`);
}
console.log("check:dates ok");
