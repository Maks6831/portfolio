---
title: "The site CSP blocks Netlify's deploy-preview drawer; preview console errors aren't the site's"
author: Muhammad
date: 2026-11-21
branch: fix/seo-audit-fixes
id: l-33cb25cd
scope: repo
status: active
src: agent
---

## Decided
- next.config.mjs sends a CSP to every route (PR #8). It uses `'unsafe-inline'` scripts with no nonces: every page is prerendered, so nonces can't work, and scripts/defer-scripts.mjs injects an inline loader. Everything else is same-origin.
- That CSP has no frame-src, so on deploy previews Chrome logs "Refused to frame 'https://app.netlify.com/'". Netlify injects its review drawer only on previews, so production is unaffected. If the owner wants the drawer for preview feedback, add `frame-src https://app.netlify.com` rather than loosening default-src.

## Watch out
- Without the CSP, previews log net::ERR_NAME_NOT_RESOLVED for cdn.segment.com and sessions.bugsnag.com. Those come from Netlify's drawer, not the site. When checking console errors, compare against https://muhammadalikhan.co.uk, which logs none.
- The JSON-LD is one @graph per page, built in src/lib/json-ld.ts. scripts/check-case-study.mjs finds the Person node inside that graph, so change both together.
- Both share cards render through src/lib/og-card.tsx, which holds the raw hex colours. check-case-study.mjs fails on hex anywhere under src/app/work, so keep the colours in that file.
