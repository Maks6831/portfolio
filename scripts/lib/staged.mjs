// Staged exceptions for the v3 build gates (story 2). The v3 rules ban things that v2 code still contains; each
// exception below names the story that removes it, so the gate can be blocking today without a silent loosening.
//
//  - A violation that matches an entry prints as a WARN line and does not fail the gate.
//  - An entry that matches nothing fails the gate ("stale"): delete it in the story that fixed the offender.
//  - An entry with `max` only covers a numeric violation up to that value (the interim JS caps); beyond it, it blocks.
//  - STRICT=1 treats the list as empty, so every staged offender fails. Story 13 must run `STRICT=1 pnpm build`.
// Raising an entry or adding one shows in that story's diff, so it is seen at its spec checkpoint. Do not add
// entries without the user's approval.
//
// Keys: check-islands `<file>|<rule>`, check-anchors `<route>|<href>`, check-budget `<route>|ceiling`,
// check-images `<route>|<rule>`.
export const STAGED = [
  // check-islands: removed with TocHighlight (story 9).
  { gate: "islands", key: "src/components/islands/TocHighlight.tsx|scroll-resize-listener", until: 9, why: "TocHighlight is replaced by CSS and the On this page row" },
];

const strict = process.env.STRICT === "1";

/** Splits a gate's violations ({ key, msg, value? }) into blocking, staged (warnings) and stale entries. */
export function resolveStaged(gate, violations) {
  const entries = strict ? [] : STAGED.filter((e) => e.gate === gate);
  const blocking = [];
  const staged = [];
  const used = new Set();
  for (const v of violations) {
    const e = entries.find((x) => x.key === v.key);
    if (!e) blocking.push(v.msg);
    else if (e.max !== undefined && v.value > e.max) {
      used.add(e);
      blocking.push(`${v.msg} (above the interim cap of ${e.max} kB owned by story ${e.until})`);
    } else {
      used.add(e);
      staged.push(`WARN staged until story ${e.until}: ${v.msg} [${e.why}]`);
    }
  }
  const stale = entries.filter((e) => !used.has(e)).map((e) => `stale staged entry ${e.gate}: ${e.key} (story ${e.until}); the offender is gone, delete it from scripts/lib/staged.mjs`);
  return { blocking: [...blocking, ...stale], staged, strict };
}

/** Prints the result for a gate and exits 1 on any blocking item. Returns the staged warnings on success. */
export function finish(gate, violations, okMessage) {
  const { blocking, staged, strict: s } = resolveStaged(gate, violations);
  if (blocking.length) {
    console.error(`check:${gate} FAILED${s ? " (STRICT=1: staged exceptions count as failures)" : ""}:`);
    for (const b of blocking) console.error("  " + b);
    for (const w of staged) console.error("  " + w);
    process.exit(1);
  }
  console.log(okMessage);
  for (const w of staged) console.log("  " + w);
}
