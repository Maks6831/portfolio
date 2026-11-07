---
title: "v3 allows exactly two new JS islands: the HUD clock and the phone pill highlight"
author: Muhammad
date: 2026-11-07
branch: feature/content-fixes
id: l-d08412a9
scope: repo
status: active
src: agent
---

## Decided
- v3 motion is CSS-only except two small islands under `src/components/islands/`, both approved by the user on 2026-11-07:
  1. HUD live London clock: starts from the server-rendered string (`suppressHydrationWarning`), ticks only in `useEffect`, pauses when the tab is hidden. It shows HH:MM:SS normally and HH:MM, updated once a minute, under `prefers-reduced-motion` (WCAG 2.2.2).
  2. Phone bottom pill nav: an IntersectionObserver (~0.5 kB) sets `aria-current` on the item for the section on screen, so the highlight isn't colour-only (accent vs text is 1.11:1).
- Phone hero is in normal flow: copy and buttons, then the giant display word, then the screenshot. Desktop keeps the overlapping layout from `key-home.html`.

## Tried and ruled out
- A pill with no highlight (zero JS): the user wanted the current section shown.
- A CSS scroll-timeline highlight: needs `animation-timeline`, which the lean rules exclude.
- Keeping the overlapping phone hero and shrinking the word: at 320px "Get in touch" overlapped the mint word by 45 of 49px (mint on mint, about 1:1).

## Watch out
- Sheet stacking, the section counter and the case-study tabs are pure `position: sticky`; don't add scroll listeners for them.
- Any further JS needs the user's approval and has to fit the per-page budget in `scripts/check-budget.mjs`.
