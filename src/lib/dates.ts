// Pure date helpers for the experience timeline. ISO input: "YYYY", "YYYY-MM" or "present".
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
