// AD-2 and v3 CAP-13: "use client" is only allowed under src/components/islands/, and the v3 lean rules hold across
// src/, tailwind.config.ts and package.json: no scroll or resize listeners, IntersectionObserver only in the pill-nav
// island, no scroll-timeline CSS, no canvas or video, no motion or scroll libraries, no backdrop-filter, no will-change.
// v2 code that still breaks a rule is listed in scripts/lib/staged.mjs with the story that removes it.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { finish } from "./lib/staged.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const root = join(repo, "src");
const islands = join(root, "components", "islands");
const allowed = islands + sep;
const PILL_NAV = "src/components/islands/PillNav.tsx"; // the only file allowed an IntersectionObserver
// Optional BOM, then any mix of whitespace and comments, then the directive.
const directive =
  /^﻿?(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*["']use client["']/;
const offenders = [];

if (!existsSync(islands)) {
  console.error("src/components/islands/ is missing");
  process.exit(1);
}

const MOTION_LIBS =
  "gsap|@gsap/[\\w.-]+|framer-motion|motion|motion/[\\w./-]+|lenis|@studio-freight/lenis|locomotive-scroll|react-spring|@react-spring/[\\w.-]+|aos|three|animejs|anime\\.js|react-scroll|scrollreveal|@use-gesture/[\\w.-]+";
const rules = [
  { id: "scroll-resize-listener", what: "scroll or resize listener", re: /addEventListener\(\s*["'`](?:scroll|resize)["'`]|\bon(?:scroll|resize)\s*=|\bon(?:Scroll|Resize)\b/ },
  { id: "intersection-observer", what: "IntersectionObserver outside the pill-nav island", re: /\bIntersectionObserver\b/, skip: (rel) => rel === PILL_NAV },
  { id: "scroll-timeline", what: "animation-timeline / view-timeline / scroll-timeline", re: /\b(?:animation|view|scroll)-timeline\b|\b(?:animation|view|scroll)Timeline\b/ },
  { id: "canvas", what: "<canvas", re: /<canvas\b/ },
  { id: "video", what: "<video", re: /<video\b/ },
  { id: "motion-library", what: "motion or scroll library import", re: new RegExp(`(?:\\bfrom\\s*|\\bimport\\s*\\(?\\s*|\\brequire\\(\\s*)["'](?:${MOTION_LIBS})["']`) },
  { id: "backdrop-filter", what: "backdrop-filter", re: /backdrop-filter|backdropFilter|\bbackdrop-(?:blur|brightness|contrast|grayscale|hue-rotate|invert|opacity|saturate|sepia)\b/ },
  { id: "will-change", what: "will-change", re: /will-change|\bwillChange\b/ },
];

// Blank out comments but keep newlines, so line numbers stay right. `//` after ":" is a URL, not a comment.
function stripComments(text, css) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  let out = text.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (!css) out = out.replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)));
  return out;
}

const violations = new Map(); // key -> { key, msg }
function scan(file) {
  const rel = relative(repo, file).split(sep).join("/");
  const css = file.endsWith(".css");
  const text = stripComments(readFileSync(file, "utf8"), css);
  for (const rule of rules) {
    if (rule.skip?.(rel)) continue;
    const m = rule.re.exec(text);
    if (!m) continue;
    const line = text.slice(0, m.index).split("\n").length;
    const key = `${rel}|${rule.id}`;
    violations.set(key, { key, msg: `${rel}:${line}: ${rule.what} (${rule.id})` });
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.[cm]?[jt]sx?$|\.css$|\.mdx?$/.test(entry.name)) {
      if (/\.[cm]?[jt]sx?$/.test(entry.name) && directive.test(readFileSync(full, "utf8")) && !full.startsWith(allowed)) {
        offenders.push(relative(process.cwd(), full));
      }
      scan(full);
    }
  }
}

walk(root);
for (const f of ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]) {
  if (existsSync(join(repo, f))) scan(join(repo, f));
}

// Motion or scroll libraries in package.json.
const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const libRe = new RegExp(`^(?:${MOTION_LIBS})$`);
for (const section of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
  for (const name of Object.keys(pkg[section] ?? {})) {
    if (libRe.test(name)) {
      const key = `package.json|motion-library:${name}`;
      violations.set(key, { key, msg: `package.json: ${section} lists the motion or scroll library "${name}" (motion-library)` });
    }
  }
}

if (offenders.length) {
  console.error('"use client" found outside src/components/islands/:');
  for (const f of offenders) console.error("  " + f);
  process.exit(1);
}
finish(
  "islands",
  [...violations.values()],
  'check:islands ok: "use client" only under src/components/islands/; no scroll/resize listeners, stray IntersectionObserver, scroll-timeline, canvas, video, motion library, backdrop-filter or will-change',
);
