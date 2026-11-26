---
title: Home compact composer and equal action cards
author: Zaphenath
date: 2026-11-26
branch: main
id: l-b4133d50
scope: repo
status: active
src: agent
touches:
  - AGENTS.md
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - components/ideas/idea-capture-dialog.tsx
  - components/ui/responsive-dialog-drawer.tsx
  - next.config.ts
  - package.json
  - pnpm-lock.yaml
---

## Decided
- Home redesign in components/home/home-page.tsx and app/globals.css: compact auto-growing composer (min ~56px, max ~160px) with Motion height transitions (~120–160ms, no bounce), footer separated by spacing only, no focus frame on textarea or composer.
- Action cards Continue / Revisit / Blank draft share equal-height compact composition; View all ideas and See all live outside .home-actions; empty Continue/Revisit stay non-actionable; restrained hover/press via CSS + Motion whileTap.
- Recorded in docs/handoff/2026-11-24/current/DESIGN-DECISIONS.txt and DESIGN.md so older Stitch Home exports do not override.

## Tried and ruled out
- Keeping View all ideas inside the Revisit card (made that card taller).
- Exact string equality for composer outline color on focus in tests/browser/phase-3.spec.ts (browser changes unused outline color while style stays none).

## Watch out
- Animate only textarea height; never scale typed text. Measure with min height then clamp. Observe parent width for resize, not the textarea itself.
- Correction/phase-3 focus tests assert no added frame; Ideas dialog capture still keeps its own focus ring.
