---
title: Collection empties share PlaceholderState with link or button actions
author: Zaphenath
date: 2026-11-25
branch: master
id: l-8021738f
scope: repo
status: active
src: agent
touches:
  - AGENTS.md
  - README.md
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - next.config.ts
  - package.json
  - pnpm-lock.yaml
---

## Decided
- Collection empty states in components/ideas/ideas-page.tsx and components/content/content-page.tsx share PlaceholderState from components/layout/placeholder-state.tsx instead of bespoke markup. Ideas keeps an onClick action that opens inline capture; Library keeps a link action to Studio.
- PlaceholderState actions are a union: href+label for navigation or label+onClick for in-page buttons, so one component covers both. app/globals.css styles both via .collection-empty :is(a, button).

## Tried and ruled out
- Pointing Ideas empty CTA at a hash/route like Library Studio link: Ideas capture is intentionally inline on the same page (tests click a button and assert no dialog).

## Watch out
- Keep .collection-empty :is(a, button) in sync when changing empty-state actions.
