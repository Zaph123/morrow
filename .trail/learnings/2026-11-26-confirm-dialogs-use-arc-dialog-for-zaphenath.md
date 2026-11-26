---
title: Confirm dialogs use Arc Dialog for motion
author: Zaphenath
date: 2026-11-26
branch: main
id: l-0cce8510
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
components/ideas/idea-capture-dialog.tsx and components/ideas/idea-detail.tsx use Arc Dialog for discard/delete confirms because Base UI AlertDialog had no Motion enter/leave while Arc Dialog already springs the overlay and panel.

## Tried and ruled out
CSS keyframes on the Base UI popup, because they would not match Arc Dialog/BottomSheet AnimatePresence springs and reduced-motion paths already in components/arc/dialog/dialog.tsx.

## Watch out
ResponsiveDialogDrawer dismissLocked must stay true while discardOpen so Escape/outside press do not dismiss capture underneath. Playwright expects role=dialog (not alertdialog) for these confirms.
