---
title: "Sticky clamps the margin box: a negative top margin lets a sticky box slip out of its section"
author: Muhammad
date: 2026-11-21
branch: fix/duplicate-footer-counter
id: l-68a8b1d0
scope: repo
status: active
src: agent
---

## Decided
- The home counter chip (`.ctr-wrap` in src/app/home.css, stack mode) is a 24px sticky box with `margin-bottom: -24px`, so sticky keeps the whole chip inside its own section. A 0-height wrap with the chip absolutely positioned at `bottom: 0` hung the chip 24px above the wrap. That put the next surface's chip over the surface beneath it, so the desktop corner read "©2026 · 01 / 03" twice (the bug fixed in PR #9).

## Tried and ruled out
- `margin-top: -24px` on the 24px wrap. Sticky clamps the *margin box* to the section, and a negative top margin shrinks that box, so the chip still slipped 24px above the section top (measured at y=877 with the section top at 900).

## Watch out
- `elementFromPoint` ignores `pointer-events: none` elements, and the counter wrap has that set, so it can't tell you whether a chip is visible. Compare the chip's `getBoundingClientRect` with its section's bounds instead.
- The home page uses smooth scrolling, so `scrollTo` followed by a short wait gives section offsets a few px off. Compare layout with `offsetTop` and `offsetHeight` at rest, not mid-scroll.
