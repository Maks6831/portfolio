---
title: "Mobile LCP 1.5 s is a hard gate for v3, not Google's 2.5 s"
author: Muhammad
date: 2026-11-07
branch: feature/content-fixes
id: l-c39b94ea
scope: repo
status: active
src: agent
---

## Decided
- v3's mobile LCP target is 1.5 s on both routes, enforced as a gate, not a goal (the brief's NFR2; the user reaffirmed it on 2026-11-07 knowing v2 measures 2.4–2.7 s). CLS stays 0.
- The levers are image weight and loading: the hero is one `next/image` with `preload` + `fetchPriority="high"` and explicit `sizes`, ≤ 60 kB at the mobile candidate, and it is the only image preload on any page. `scripts/check-images.mjs` enforces the weights.

## Tried and ruled out
- A 2.5 s gate with 1.5 s as a stretch goal (Google's "good" line): offered and declined.

## Watch out
- `public/work/simply-happy/*.png` are 2880×1800 and up to 1.3 MB each; never serve them raw or as CSS backgrounds.
- Lighthouse doesn't run on production deploys (Netlify API deploys skip plugins; see `_bmad-output/implementation-artifacts/deferred-work.md`), so the gate needs its own run in the build or CI.
- The HUD clock ticks seconds for only 5 s after load, then settles to HH:MM in the same reserved box. That keeps WCAG 2.2.2 satisfied; don't make it tick indefinitely.
