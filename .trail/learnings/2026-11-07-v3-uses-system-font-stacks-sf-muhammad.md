---
title: "v3 uses system font stacks (SF Pro / SF Mono on Apple), no web font"
author: Muhammad
date: 2026-11-07
branch: feature/content-fixes
id: l-52251939
scope: repo
status: active
src: agent
---

## Decided
- v3 typography is the system stacks the approved mocks used: sans `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`; mono `ui-monospace, "SF Mono", Menlo, Consolas, monospace`. On Apple devices this renders SF Pro / SF Mono, exactly what the user approved in `_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-07/.working/key-*.html`.
- No web font is loaded: the `next/font` Inter import in `src/app/layout.tsx` goes when v3 is built. This also removes a font download, in line with the 175 kB / fast-on-phone rules.

## Tried and ruled out
- Embedding SF Pro: Apple's licence restricts it to Apple platforms; it cannot be served as a web font.
- Keeping Inter, or switching to Inter Tight or Space Grotesk: the user asked for the fonts from the mocks they approved, which were the system fonts, not any of these.

## Watch out
- Windows shows Segoe UI and Android shows Roboto; that difference is accepted, not a bug.
- Don't size the giant display word against one font's metrics alone; check it on Segoe UI and Roboto as well as SF Pro.
