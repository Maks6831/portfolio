#!/usr/bin/env node
// v3 release step (story 13, CAP-13; gates.md "Release checks"). Not part of `pnpm build` and not CI:
// run it by hand against the Netlify deploy preview before v3 merges to main.
//
//   node scripts/release-lcp.mjs https://deploy-preview-2--<site>.netlify.app
//
// Lighthouse default mobile (simulated throttling), 3 runs per route, median. A route breaches when its
// median LCP is over 1.5 s or its median CLS is above 0; any breach exits 1 and blocks the merge.
//
// Netlify injects its deploy-preview toolbar (the Netlify Drawer: /.netlify/scripts/cdp, app.netlify.com,
// Segment, Bugsnag; about 1.6 MB) into every preview page. Production never serves it, so those URLs are
// blocked to measure what production will serve.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base || !/^https?:\/\//.test(base)) {
  console.error("usage: node scripts/release-lcp.mjs <deploy-preview-url>");
  process.exit(2);
}

const ROUTES = ["/", "/work/simply-happy"];
const RUNS = 3;
const LCP_MAX_MS = 1500;
const CLS_MAX = 0;

const DRAWER = ["*/.netlify/scripts/cdp*", "*app.netlify.com*", "*cdn.segment.com*", "*bugsnag.com*"];

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const dir = mkdtempSync(join(tmpdir(), "release-lcp-"));
let failed = false;

try {
  for (const route of ROUTES) {
    const url = base + route;
    const lcp = [];
    const cls = [];
    for (let i = 1; i <= RUNS; i++) {
      const out = join(dir, `run-${route.replace(/\W+/g, "_")}-${i}.json`);
      execFileSync(
        "npx",
        ["--yes", "lighthouse@12", url, "--only-categories=performance", "--output=json", `--output-path=${out}`,
          "--quiet", "--chrome-flags=--headless=new", ...DRAWER.map((p) => `--blocked-url-patterns=${p}`)],
        { stdio: ["ignore", "ignore", "inherit"] },
      );
      const audits = JSON.parse(readFileSync(out, "utf8")).audits;
      lcp.push(audits["largest-contentful-paint"].numericValue);
      cls.push(audits["cumulative-layout-shift"].numericValue);
      console.log(`  ${route} run ${i}: LCP ${(lcp.at(-1) / 1000).toFixed(2)} s, CLS ${cls.at(-1).toFixed(3)}`);
    }
    const mLcp = median(lcp);
    const mCls = median(cls);
    const ok = mLcp <= LCP_MAX_MS && mCls <= CLS_MAX;
    if (!ok) failed = true;
    console.log(`${ok ? "PASS" : "FAIL"} ${route}: median LCP ${(mLcp / 1000).toFixed(2)} s (max 1.5), median CLS ${mCls.toFixed(3)} (max 0)`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log(failed ? "release-lcp FAILED: the merge to main is blocked" : "release-lcp ok: both routes within LCP 1.5 s and CLS 0");
process.exit(failed ? 1 : 0);
