// Pure date helpers for the experience timeline and the case study. ISO input: "YYYY", "YYYY-MM" or
// "present" for ranges; "YYYY-MM-DD" for a single day.
// Keep this file free of imports and non-erasable syntax so scripts/check-dates.mjs can load it.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Parsed = { year: number; month: number | null };

function parse(value: string): Parsed | null {
  const m = /^(\d{4})(?:-(0[1-9]|1[0-2]))?$/.exec(value);
  if (!m) return null;
  return { year: Number(m[1]), month: m[2] ? Number(m[2]) : null };
}

function label(p: Parsed): string {
  return p.month === null ? String(p.year) : `${MONTHS[p.month - 1]} ${p.year}`;
}

/** Whole months from start to end, counting both calendar months. Null unless both are year-month. */
export function monthsBetween(start: string, end: string, now: Date = new Date()): number | null {
  const s = parse(start);
  const e = end === "present" ? { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 } : parse(end);
  if (!s || !e || s.month === null || e.month === null) return null;
  const n = (e.year - s.year) * 12 + (e.month - s.month) + 1;
  return n > 0 ? n : null;
}

function formatDuration(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? "mo" : "mos"}`;
  const y = Math.floor(months / 12);
  const r = months % 12;
  const years = `${y} ${y === 1 ? "yr" : "yrs"}`;
  return r === 0 ? years : `${years} ${r} ${r === 1 ? "mo" : "mos"}`;
}

/** "Nov 2024 – Sep 2025 · 11 mos"; year-only ranges show no duration. */
export function formatRange(start: string, end: string, now: Date = new Date()): string {
  const s = parse(start);
  if (!s) return "";
  // A malformed end must not read as "Present": render nothing so it is noticed.
  if (end !== "present" && !parse(end)) return "";
  const e = end === "present" ? null : parse(end);
  const range = `${label(s)} – ${e ? label(e) : "Present"}`;
  const months = monthsBetween(start, end, now);
  return months === null ? range : `${range} · ${formatDuration(months)}`;
}

/** "18 Oct 2026" from "2026-10-18"; "" on malformed input (including impossible days such as 31 Feb). */
export function formatDay(iso: string): string {
  const m = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(iso);
  if (!m) return "";
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  // A day past the end of its month would roll over into the next one: render nothing instead.
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return "";
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
