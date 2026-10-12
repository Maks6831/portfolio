// AD-2: "use client" is only allowed under src/components/islands/.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src", import.meta.url));
const islands = join(root, "components", "islands");
const allowed = islands + sep;
// Optional BOM, then any mix of whitespace and comments, then the directive.
const directive =
  /^﻿?(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*["']use client["']/;
const offenders = [];

if (!existsSync(islands)) {
  console.error("src/components/islands/ is missing");
  process.exit(1);
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      if (directive.test(readFileSync(full, "utf8")) && !full.startsWith(allowed)) {
        offenders.push(relative(process.cwd(), full));
      }
    }
  }
}

walk(root);
if (offenders.length) {
  console.error('"use client" found outside src/components/islands/:');
  for (const f of offenders) console.error("  " + f);
  process.exit(1);
}
console.log('check:islands ok: "use client" only under src/components/islands/');
