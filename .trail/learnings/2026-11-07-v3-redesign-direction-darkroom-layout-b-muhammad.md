---
title: "v3 redesign direction: Darkroom layout, B's stacking sheets, Conservatory palette, lean rules kept"
author: Muhammad
date: 2026-11-07
branch: feature/content-fixes
id: l-a77f3775
scope: repo
status: active
src: agent
---

## Decided
- Visual direction for the v3 redesign (UX run `_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-07/`, memlog is canonical): "Darkroom" layout (CSS laptop frame bleeding off the right, one giant display word per project, mono HUD labels in the four corners, bottom pill nav on phones) with the work section using "Broadsheet"'s stacking sheets (full-viewport `position: sticky` sheets, copy left third, frame right two-thirds, tabs piling into a free TOC).
- Palette "Conservatory": stage #0A1410, bezel #122119, line #1F3329, text #E6F2EB, muted #86A393, accent mint #B9F0D3, focus ring = accent. All AA; ratios in `.working/color-themes-1.html`.
- Performance posture unchanged from v2: 175 kB first-load JS gate, CSS-only motion, static under reduced-motion, no WebGL, no scroll-hijacking. The one JS addition is a tiny live-clock island for the HUD.
- Case-study screenshots sit inside the section they illustrate; the end-of-page gallery (Story 2.6) goes.

## Tried and ruled out
- Direction "Film" (suho-style full-bleed screenshot as viewport background, horizontal pinned track): user preferred A's design.
- Direction "Broadsheet" as a whole (light paper/cobalt one-pager): only its sheet-stacking scroll was wanted.
- Palettes Darkroom lime, Voltage cyan, Ember amber, Bone monochrome: user chose green.
- A's own pinned-laptop crossfade (needs `animation-timeline: view()`): replaced by B's sticky sheets, which need no scroll timeline.

## Watch out
- The navy #000319 / lavender #CBACF9 tokens in `tailwind.config.ts` and the 2026-10-12 DESIGN.md are superseded; do not extend them.
