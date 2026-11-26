# Morrow — Stitch to Next.js translation rules

**Status:** Authoritative repository rule file. Older packet copies are historical; do not treat them as the live source of truth.

**Audience:** Any agent implementing or reviewing Stitch-derived UI for Morrow.

**Required reading before Stitch-derived UI work:** this file and root `DESIGN.md`. Also follow root `AGENTS.md` and the current collaboration / scope docs under `docs/handoff/2026-11-24/current/`.

## Purpose

Next.js is the confirmed target. Stitch HTML and PNGs describe design and content; they are not production code, a backend contract, or a runnable Next.js application. These are Morrow-specific implementation rules.

Use with `FIRST-BUILD-SCOPE.txt`, design decisions, flows/data, auth flows, screen map, and known-export issues from the current handoff set. Do not start product implementation merely because these rules exist. Obtain phase approval per `docs/handoff/2026-11-24/current/CODEX-COLLABORATION.txt` before visual conversion slices.

## 1. Inspect the real repository before changing it

Read `AGENTS.md`, `DESIGN.md`, and current product / architecture / design guidance. Inspect `package.json`, lockfile, Next.js version, App Router vs Pages Router, TypeScript, Tailwind version, global CSS, existing UI primitives, auth clients, services, schemas, hooks, icons, test tools, scripts, and current stored data.

Next.js is user-confirmed. The user retains shadcn/ui and adds UIArc alongside it. Verify actual installation / versions and Arc’s documented React 19 compatibility. Historical notes reported Tailwind 4 / pnpm; do not import Churchera’s RHF, Zod, bun:test, toast manager, API envelopes, or domain folders.

Do not migrate routers, change package managers, or create a parallel app merely to match a generated example structure.

## 2. Use the export as reference material

The export is preserved under the handoff `reference-export/` (and related archives). Do not copy its pages, scripts, Tailwind config, or complete class lists into application source. Do not generate a second raw-HTML app, iframe screens, or render whole exports with `dangerouslySetInnerHTML`. Convert the intended layout into typed JSX/TSX.

HTML may be read to recover labels, content, relationships, and intended geometry when a PNG is blank or incomplete. Screenshots alone are not authoritative in those cases; current written decisions outrank rendering defects.

Do not re-create wide mobile canvases, black image regions, missing headers, stale colours, or malformed positioning from the export.

## 3. Reuse before inventing

Search beyond the feature folder for existing components, hooks, schemas, services, state machines, auth helpers, and loading / error patterns. Prefer direct reuse, then a small Morrow-specific wrapper / composition, then a new implementation following a suitable repository precedent. Record the useful precedent or explain briefly why a new component is needed. Do not require verbose no-result reports for every trivial file.

If multiple routes need the same presentation override, define it once in a shared wrapper rather than repeating per-screen fixes. Use installed libraries where they fit. Add only dependencies needed for the authorized scope, explain their purpose, and avoid duplicate UI / animation stacks. No new motion, toast, form, or icon library solely because Stitch used one.

Before introducing or replacing a tab, segmented control, select, dropdown, or menu for Stitch-derived UI, inspect the relevant UIArc catalog entry and its actual component source. Check its dependencies, license/tier, controlled state, keyboard behavior, accessible selected state, responsive behavior, reduced-motion handling, and Morrow token fit. Compare it with existing shadcn/Base UI primitives and the selected Stitch state. Use a suitable UIArc component when one fits. If none fits, explain the mismatch and recommend the best existing shadcn/Base UI option. Treat a custom implementation as the last option and get user approval before building one.

UIArc is an explicitly approved addition; read `docs/handoff/2026-11-24/current/UIARC-INTEGRATION.txt` and `.cursor/rules/arc.mdc`. Licensed TSX / CSS-module source may be installed selectively using the shadcn registry. This does not permit copying Stitch HTML or replacing shadcn/ui. Keep one shared Morrow component contract per responsibility and map Arc’s foundation to Morrow’s theme without overwriting shadcn defaults. New shared interactions still need review / approval per `AGENTS.md`.

## 4. Preserve working behaviour; separate functional changes

During visual conversion preserve existing validation, service calls, route protection, ownership checks, mutation handling, and usable manual workflows. Missing auth / persistence behaviour must be implemented as explicit functional slices. Do not preserve a broken save simulation under the banner of restyling, or silently rewrite working logic to simplify markup.

Inspect historical storage models and preserve / migrate real data deliberately. Do not change stored status values simply to match display labels. Preserve both browser storage formats until an approved migration.

## 5. Next.js composition and client boundaries

Follow the actual router. Layouts own the app shell, fonts, navigation, and shared landmarks; pages compose feature views. Use Server Components by default where compatible; isolate interactive forms, tabs, editors, dialogs, and mobile navigation into small Client Components.

Do not put `"use client"` on the whole app to make copied browser scripts run. No `window` / `document` / `localStorage` access at module evaluation or server render. Pass serializable data across server / client boundaries. Keep privileged keys, server-only SDKs, and provider calls out of browser bundles.

Use the project’s Supabase server / browser / session pattern appropriate to its installed Next.js version; do not invent proxy / middleware filenames blindly. Resolve auth / session loading before protected content, avoiding misleading signed-out / empty flashes. Use owner-authorized mutations and database policies.

## 6. Build shared components once

Responsibilities to locate / reuse / extract:

- App shell and desktop sidebar with footer Sign out
- Mobile floating navigation and the common Brain icon
- Button variants, labelled fields, inline errors, and save-status feedback
- Profile header shared by Profile / Account on each viewport
- Horizontal section tabs with active-tab visibility
- Collection rows, skeletons, first-use empty, no-results, and load-error states
- Overlay foundation: desktop dialog and mobile bottom-sheet composition
- Studio editor / Discuss / context / proposal components
- Brand Brain form sections, writing-example editor, and learning review item

Do not generate a unique sidebar, token theme, or overlay per exported state. Use one shared shell `main` landmark; avoid nested `main` elements. Use labels for form controls and headings for actual sections. Morrow does not adopt Churchera’s blanket ban on semantic `header` / `footer` / `section` elements; compose landmarks correctly.

## 7. Map values to Morrow tokens, not Churchera tokens

Inspect tokens that actually exist before using token classes. Reuse matching ones; define missing agreed Morrow roles once in the global design layer. Do not invent undefined utility classes or use a similar-looking wrong token.

No raw palette / hex styling scattered through TSX. Hex primitives belong in the global token definition; components consume semantic roles. For Tailwind 4 use the existing CSS-first `@theme` / variable bridge. Do not import Tailwind 3 config scripts or create a second theme. If the repo uses another version, follow it until an explicit migration is justified.

Morrow roles include canvas, surface, text, secondary text, border, neutral control, primary lime, selected navigation, error / danger, and focus — as specified in root `DESIGN.md`. Do not import Churchera’s navy / gold colours, `bg-deep-blue-container`, or ambassador exceptions. Do not assume a generic `bg-card` token represents Morrow’s surfaces.

## 8. Preserve exact agreed typography and geometry

Do not mechanically round 15px section labels to 14px / 16px or 18px because those utilities happen to exist. Define a reusable 15px / 20px medium settings-label role. Page headings 24 / 32, mobile form text 16px, and established supporting scales must remain consistent. Typography roles belong in CSS / theme or shared components.

**Fonts (current implementation contract):**

- Approved face is DM Sans throughout, including adopted Arc components.
- Load with the installed `next/font/local` from the committed assets under `app/fonts/` (`DMSans-variable.ttf`, `DMSans-Italic-variable.ttf`).
- `app/fonts/` is a **font asset directory only**, not an App Router route. Do not add a font-preview page, route segment, or `page.tsx` there unless separately requested and approved.
- Retain license and provenance: `app/fonts/OFL.txt`, `app/fonts/SOURCE.md`, and related metadata. Do not remove them or replace the pinned local assets with runtime Google Fonts / other font-service fetches.
- Remove exported Google-font links in page bodies. Avoid per-element font overrides that fight the shared typography system. Monospace roles may use system fonts where the app already does.

Use the existing spacing / radius scale, mapping standard geometry to utilities where exact: desktop avatar 128px, mobile 96px, cover 160px / 112px, sidebar 240px. Use central semantic sizes for needed values not represented by existing tokens. Avoid arbitrary values scattered across routes. A genuine one-off calculation may be local and explained; runtime-driven editor / viewport geometry is not banned. Do not force arbitrary-value grep hits to zero by changing the approved layout.

## 9. Navigation and icons are fixed assets

Use the installed icon library where it matches approved assets. No Material Symbols fonts, psychology / neurology substitutions, or page-specific icon redraws. The exact Brain geometry is `assets/brain.svg` (or the repository’s locked Brain asset). Verify the installed Brain icon matches it; otherwise use one shared `BrainIcon` component with that geometry. Do not add an SVG loader dependency solely for this icon. A single central SVG component is permitted.

Reuse the same icon components throughout desktop / mobile routes. Use Next `Link` or the existing router mechanism for internal destinations and buttons for actions. No `href="#"` navigation or invented dead destinations. Defer Calendar in the live first-build nav per first-build scope. Keep red Sign out in the desktop sidebar; mobile Account retains red Sign out. Carry the user’s requested selected Brain pill on You mobile as a documented visual exception without falsely announcing the Brain route as the current page.

## 10. Morrow-specific visual exceptions

Enabled primary submissions are lime, secondary actions neutral, disabled grey. Add context is an approved filled neutral pill; other controls use their roles. Fields are flat with fine borders. Browsing lists are not stacks of cards. Temporary dialog / popover / sheet shadows are allowed; do not remove overlay depth with a global shadow ban. Do not introduce resting shadows on every surface.

## Visual acceptance gate

Apply [`.agents/rules/stitch-visual-acceptance.md`](stitch-visual-acceptance.md)
to every changed Stitch-derived screen. It requires matched source/output states,
measured bounds and computed styles, per-screen/per-viewport scoring, and explicit
reporting of approved exceptions. It supplements these conversion rules and the
approved system in `DESIGN.md`; it does not replace them.

The personal cover’s mint / peach gradient is an approved replaceable fallback. Do not ban all gradients as in Churchera, and do not spread it onto workspace, fields, or toolbars. No invented glass / glow / shader effect or animated background. Approved paper illustrations may use gentle internal depth. Keep decorative SVG illustration assets separate from navigation components and content data.

No final dark theme is approved. Arc / Motion dependencies and tokens may support selectively adopted Arc components; do not introduce another animation stack or blanket animations. Respect reduced motion and honest request feedback. Arc CSS modules are permitted; do not force all owned component internals into Tailwind classes or reject their approved scoped CSS mechanically.

## 11. Overlays must use the real viewport

Reuse installed accessible primitives where suitable. Inspect their overlay, focus, close-button, and portal defaults; do not assume content `className` reaches the backdrop. Centralize necessary Morrow presentation in shared wrappers. Desktop context / example forms use centred dialogs; mobile forms use bottom sheets. Studio desktop Discuss remains docked, not a modal overlay.

Use full-viewport backdrop and sheet positioning, safe-area padding, internal scrolling, focus return, background inertness, and keyboard-safe actions. Do not fix a 390px-wide screenshot column inside a desktop layout and call it responsive. The app is fluid at mobile / tablet / desktop; 390×844 is a test viewport, not a production fixed-width body or phone frame.

## 12. Replace prototype scripts with real state

Convert class / for / events to React forms and use keyed components for lists. Do not port inline event attributes, global functions, `querySelector` mutations, `document.write`, arbitrary `innerHTML`, or timer-based Saved success. Reuse the project’s form / validation / mutation strategy rather than importing Churchera’s RHF / Zod stack automatically.

Dirty state must include link / example adds, edits, and removes. Async completion must acknowledge the exact revision. No fake local success, auto-accepted learning, hidden extra Account panels, invented personal details, or simulated Google linking.

## 13. Assets and fixture data

Use actual local / approved illustration assets with the project’s image strategy. Use `next/image` for suitable content images with dimensions / remote allowlists where needed; SVG / icon components may use their appropriate existing pattern. Do not hotlink Stitch / googleusercontent preview assets as permanent UI content.

Mock names, sample emails, and draft text stay in explicit fixtures / dev previews, not production user profiles, auth screens, or seeded publication history. Personal profile fields do not silently become Brand Brain preferences.

## 14. Verification that matches the change

Run the repository’s actual typecheck / lint / build and meaningful behaviour tests after each substantive slice. Do not assume Churchera’s scripts or bun:test. Protect save / reopen, failed-save recovery, accept / undo, explicit context selection, learning approval, auth callbacks, and owner-scoped account linking with useful tests. Avoid snapshot-only tests that merely mirror a component’s markup.

Capture the real Next.js app at 390×844, narrower mobile, tablet, and desktop. Compare against selected references plus written corrections, not broken PNGs. Check keyboard focus, viewport sheet edges, safe areas, zoom, text wrapping, active-tab visibility, reduced motion, and hydration / server-client boundaries. No dark-mode screenshot gate unless the existing app / task actually includes it.

## 15. Focused conversion checks

Run these against actual changed feature files (exclude handoff packets / reference archives), adapting paths to the real repo. Inspect each result in context.

**Source contamination** — unintended matches must be removed:

```text
rg -n "cdn\.tailwindcss|material-symbols|font-headline|font-body|primary-fixed|onclick=|onsubmit=|onchange=|href=.#" <changed-source-files>
```

**Unsafe / demo patterns** — review, not a blind empty-output rule:

```text
rg -n "dangerouslySetInnerHTML|innerHTML|setTimeout|localStorage|sessionStorage" <changed-source-files>
```

Real editor selection, debouncing, safe recovery storage, or existing application behaviour can legitimately use some browser APIs / timers. They cannot fake saving.

**Presentation drift** — inspect roles and approved exceptions:

```text
rg -n "#[0-9a-fA-F]{3,8}|text-\[|bg-gradient|shadow-|backdrop-blur|animate-pulse" <changed-source-files>
```

Expected exceptions include central token primitives, approved cover gradients, overlay shadows, and justified layout values. Do not fix legitimate matches by degrading the design. No claim that grep alone proves accessibility or correctness.

## Report

State changed files / components, reused precedents, functional changes separated from presentation, checks actually run, and material remaining gaps. Do not paste fictional empty command output or claim a mocked backend is implemented.

## Authority and copies

| Location | Role |
| -------- | ---- |
| `.agents/rules/stitch-to-morrow.md` | **Authoritative** live rules |
| Root `DESIGN.md` | Authoritative visual system for Stitch-derived UI |
| Root `AGENTS.md` | Product / approval boundaries; requires reading the two files above for Stitch UI |
| `.cursor/rules/stitch-to-morrow.mdc` | Cursor pointer to this file |
| `docs/handoff/2026-11-24/historical-context/STITCH-TO-NEXTJS-RULES.txt` | **Historical** packet provenance only |
