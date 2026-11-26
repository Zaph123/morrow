---
title: ResponsiveDialogDrawer is breakpoint switch only
author: Zaphenath
date: 2026-11-26
branch: main
id: l-294d0e69
scope: repo
status: active
src: agent
touches:
  - AGENTS.md
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - next.config.ts
  - package.json
  - pnpm-lock.yaml
---

## Decided
components/ui/responsive-dialog-drawer.tsx stays a shared breakpoint switch (Dialog desktop / BottomSheet mobile) because Arc already owns dismiss, drag, and a11y. Duplicating those in a Morrow wrapper was over-engineering.

## Tried and ruled out
Focus snapshot and selection restore across media-query remounts in ResponsiveDialogDrawer, and remounting BottomSheet via a short-viewport key, because those only matter on rare mid-open resizes and cost more complexity than they save.

## Watch out
Callers own focus and styling. components/ideas/idea-capture-dialog.tsx uses textarea autoFocus and passes dialogClassName / sheetClassName for the morrow-capture CSS hooks.
