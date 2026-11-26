# Phase 3: Ideas and legacy Library presentation

Approved scope: Ideas text capture/list/detail and legacy Library presentation, using the selected Stitch designs and written corrections. This report records the bounded conversion; attachment, Studio, account and Brand Brain functionality remains deferred.

## Changes and preserved contracts

Ideas now has the selected centered heading/search/list anatomy, flat divided rows and the reference-style segmented Not developed filter. The original Phase 3 text composer was hidden by default and opened inline from New idea entry points. The approved interaction follow-up now routes those same entry points to one shared desktop dialog/mobile bottom sheet; details and verification are recorded in [the capture and sidebar interaction report](CAPTURE-SIDEBAR-INTERACTIONS-REPORT.md). Failed saves preserve text and use the existing `createIdea` handler; successful saves close capture. The first line of existing idea text supplies each row heading and remaining lines supply its preview. No title field is created. Local filtering preserves collection order and does not write storage.

Library now uses the selected Library heading, search, flat writing rows, metadata, status filtering and existing Studio reopen links. Its segmented filter preserves the real `all`, `draft`, `ready` and `published` values; no stored status is rewritten to an exported label such as Approved. Search and filter controls are hidden only for a successfully loaded, genuinely empty collection. Loading, first-use empty, filtered no-results and read-failure states remain distinct. Empty states use decorative paper SVGs derived from the supplied source artwork; their provenance is recorded inside the assets.

Idea detail now has the single original-idea surface, captured metadata, a lime Studio action outside the card, and flat linked-draft rows. The no-drafts state uses Develop in Studio and omits the drafts section. Existing save buttons and dirty/retry feedback remain available. The approved interaction follow-up replaces native delete confirmation with the shared in-app destructive confirmation and persistent success toast. Delete remains in the card footer. The idea remains editable with the existing Textarea and its visible keyboard focus treatment. Scoped content sizing removes the unnecessary fixed blank editor area; it does not change text or save behavior.

All live handlers continue to call `lib/storage.ts` with `types/index.ts` records. No mutation handler, storage binding, schema, ID generator, formatter or validator was replaced. Unknown metadata, creation time and successful-mutation-only update time remain protected by the existing regressions. Workspace-store capture/list components were not substituted into these routes. The independent workspace editors and both browser stores remain intact.

Home, mobile navigation and their compositions were not redesigned. New presentation selectors target the collections or uniquely prefixed segmented-control classes. The Home composer remains visually unchanged while focused. Existing custom Tailwind loader rules treat all CSS files as global sheets, so the UIArc control’s reviewed behavior was adapted into prefixed rules in the existing global stylesheet instead of relying on a CSS module that would export `undefined` styles.

## Files changed in this phase

- `components/ideas/ideas-page.tsx`
- `components/ideas/new-idea-link.tsx` (same-route sidebar entry point)
- `components/ideas/idea-detail.tsx`
- `components/content/content-page.tsx`
- `components/arc/segmented-control/segmented-control.tsx` (adapted from the inspected free MIT UIArc component)
- `components/layout/app-sidebar.tsx`
- `app/globals.css` (scoped Phase 3 presentation only)
- `public/illustrations/ideas-paper.svg`, `library-paper.svg` (decorative supplied-source artwork)
- `tests/browser/phase-3.spec.ts`
- `tests/browser/server-setup.mjs` (owns and tears down the isolated loopback Next server process)
- `scripts/helpers/local-runtime.mjs` (mock support for the UIArc control and requestAnimationFrame)
- `playwright.config.ts` (separate Phase 3 selection, results and traces)
- `.agents/rules/stitch-to-morrow.md` and `AGENTS.md` (required UIArc catalog/source review rule and reference)
- This report and the comparison evidence under `artifacts/phase-3/comparisons/`.

Existing unrelated work was retained. No project dependency, user data, backend, commit, push or deployment change is part of this phase.

## Reference comparisons and deliberate differences

Original targets are listed in [the approved proposal](PHASE-3-PROPOSAL.md) and the maintained [catalogue](../../../artifacts/references/stitch/SCREEN-CATALOGUE.csv). App captures under `artifacts/phase-3/` are verification evidence only. Original PNGs and HTML were inspected. Side-by-side captures use 1280x1024 CSS pixels for desktop, 353x800 for Ideas/empty mobile and 343x800 for populated Library mobile. The Ideas populated mobile PNG is blank, so its catalogued HTML source was attempted over loopback.

- Ideas: first-use empty uses `ideas_desktop_empty` and `ideas_mobile_empty`; populated desktop uses `ideas_desktop_spacious_list`. The mobile populated PNG omits content, and its HTML source depends on external Tailwind and font URLs. Edge reported `net::ERR_NETWORK_ACCESS_DENIED` for `https://cdn.tailwindcss.com/`, Google Fonts and Material Symbols, leaving the source main element at `display: block`. That raw, unstyled rendering was excluded from comparisons; the limitation and selected source path are recorded in `ideas-mobile-source-render-status.md`, alongside the app output screenshot. The responsive text composer remains hidden until an entry point is chosen and preserves failed input.
- Library: empty uses `library_desktop_empty` and `library_mobile_empty`; populated uses `library_desktop_list` and `library_mobile_list_revised`. Compared heading, search width, segmented treatment, row typography, title/preview hierarchy, separators and metadata. Search and row spacing/type were tightened after comparison. Real legacy platform/status/source relationships replace exported multi-platform examples; the extra Ready segment preserves the supported `ready` value. Independent platform-version functionality is deferred.
- Detail: `idea_desktop_detail`, `idea_mobile_detail` and their no-drafts counterparts. Compared original white surface, text measure, captured footer, action outside the card and linked-draft rows. The real Textarea and explicit save/retry/delete controls replace the prototype contenteditable/copy/context controls. No copy control was newly introduced. Text uses the creator's actual line breaks.
- Empty/error/loading/no-results: used the paired state sources in the proposal. Empty artwork and centered state copy follow the source family. The persistent capture, search and filter controls, truthful error details and retry wording account for intentional spacing/content differences. Loading placeholders do not animate or fake saved success.

The segmented filter uses the inspected [UIArc Segmented Control](https://uiarc.dev/components/segmented-control), an existing-dependency (`motion`) controlled component with `aria-pressed`, roving focus, Arrow/Home/End keyboard behavior, reduced-motion handling and responsive overflow. Its source is free/MIT ([UIArc licensing](https://uiarc.dev/docs)); no dependency was added. The component’s selection and keyboard behavior were retained while its colors, sizing and focus ring were mapped to Morrow tokens. The 240px white sidebar, supplied Brain asset, existing mobile top bar, real route selection and current navigation omissions remain the approved shared shell. Date formatting and storage ordering remain unchanged. Lists scroll and retain bottom-navigation clearance.

## Verification

The complete existing Node suite passed: **34 tests, 0 failures** (`node --test scripts/test-*.mjs`). The local component harness now stubs the UIArc presentation-only control and supplies the animation-frame APIs used by the entry-point effect.

`pnpm.cmd build` passed after the final application changes. `pnpm.cmd exec tsc --noEmit` passed. Focused ESLint on the changed TS/JS modules passed.

The final Playwright Edge suite passed **12/12 tests** (0 failures, 0 flaky), including empty/error/no-results separation, cross-route and same-route capture, retry/reopen, keyboard-selected filters, exact-size references and Home focus invariance. The runner exited normally with code 0. Playwright now starts Next as a directly owned child and its teardown stops the child process tree; it refuses to take over an already occupied loopback URL. Tests used the installed `msedge` channel, isolated browser contexts and synthetic records only.

The earlier Phase 2 Edge run completed **21/22** tests; its 1024px Home/navigation case timed out at 45 seconds while its snapshot showed the final You route. That case passed alone in 8.8 seconds. The final Phase 3 run also passed the 1024px route case (13.7 seconds). Treat the earlier timeout as a transient run-level flake; it did not recur in the completed Phase 3 suite.

The 201 extracted archive source files were hash-compared against their ZIP entries: **0 mismatches**. Original archives and reference classifications were not edited.

`git diff --check` passed. The retained Phase 2 lint limitation is 18 `@typescript-eslint/no-require-imports` errors in generated/historical CommonJS files: `.cursor/hooks/trail-hooks.cjs` (6), `.trail/hook.cjs` (6), `.trail/statusline.cjs` (5), and `artifacts/phase-2/inspect-development.cjs` (1). No errors were reported for the focused changed-file lint run.

Comparison evidence (original Stitch source on the left, Morrow output on the right where the source renders):

- [Ideas empty desktop](../../../artifacts/phase-3/comparisons/ideas-empty-desktop-comparison.png), [empty mobile](../../../artifacts/phase-3/comparisons/ideas-empty-mobile-comparison.png), [populated desktop](../../../artifacts/phase-3/comparisons/ideas-list-desktop-comparison.png)
- [Ideas populated mobile app output](../../../artifacts/phase-3/comparisons/ideas-list-mobile-morrow.png) and [source-render limitation](../../../artifacts/phase-3/comparisons/ideas-mobile-source-render-status.md)
- [Library empty desktop](../../../artifacts/phase-3/comparisons/library-empty-desktop-comparison.png), [empty mobile](../../../artifacts/phase-3/comparisons/library-empty-mobile-comparison.png), [populated desktop](../../../artifacts/phase-3/comparisons/library-list-desktop-comparison.png), [populated mobile](../../../artifacts/phase-3/comparisons/library-list-mobile-comparison.png)
- [Idea detail desktop](../../../artifacts/phase-3/ideas-reference-desktop.png), [mobile](../../../artifacts/phase-3/idea-detail-390.png), [no drafts](../../../artifacts/phase-3/idea-no-drafts-390.png), [save failure](../../../artifacts/phase-3/idea-save-failure.png)
- [Home resting](../../../artifacts/phase-3/home-rest.png), [Home focused](../../../artifacts/phase-3/home-focused.png)

## Conversion status and boundary

| Feature | Presentation status | Functional boundary |
| --- | --- | --- |
| Ideas capture/list | Partially converted; visual review pending | Inline text capture; local search/filtering; existing legacy save/retry |
| Idea detail and linked writing | Converted within Phase 3 | Existing edit/save/delete/reopen; no attachments or context selection |
| Legacy Library | Partially converted; visual review pending | Legacy records and existing Studio reopen path; no store unification or platform-version model |
| Home/sidebar/shared light foundation | Previously converted, preserved | Current Phase 2 omissions retained |
| Context attachments | Awaiting conversion | No controls, forms, menus or persistence added |
| Studio / newer editors / You | Partially converted through shared foundation only | Feature compositions await their own conversion phases |
| Brand Brain | Awaiting conversion | Existing placeholder remains |

The Ideas populated mobile HTML could not be rendered with its CDN-dependent styling in this network-restricted Edge session, so that state has app output plus the source code and an explicit blocker record rather than a misleading screenshot comparison. No pixel-identical claim, Safari/Firefox coverage, screen-reader audit or real authentication/cloud/AI verification is made. Successful route smoke tests are regression evidence and do not establish visual completion for deferred screens. Stop at the Phase 3 boundary for visual review; do not begin a later phase from this report.

## Interaction acceptance correction

The bounded capture/sidebar and idea-detail correction, measured responsive states, screenshot evidence and final verification are recorded in the [capture/sidebar interaction report](CAPTURE-SIDEBAR-INTERACTIONS-REPORT.md). This follow-up identified and fixed the coarse-pointer button-width selector collision, which had forced all shared buttons to 44px. The final pointer-profiled Edge run passed 21/21; Node regressions passed 34/34; TypeScript and production build passed. Full lint reports 18 existing CommonJS `no-require-imports` errors, listed in the interaction report. Visual review remains the acceptance boundary.

## 2026-11-26 critique follow-up

The [Impeccable critique](../../design-reviews/2026-11-26-home-ideas-library-critique.md) identified four clarity issues. Home’s empty card now says **Recent writing** while retaining the truthful “No drafts yet” message. Ideas keeps both entry points shown by the selected Stitch empty screen, but the header plus is ghost-weighted and the central **New idea** action remains prominent. The mobile Idea breadcrumb wraps the full title without ellipsis. The destructive action now has a visible **Delete idea** label and stays in the idea card, visually distinct from the lime Studio action outside it. Existing handlers, routes and records are unchanged.

Evidence is in [Home’s empty mobile capture](../../../artifacts/phase-3/home-empty-writing-hierarchy.png), [Ideas’ empty mobile comparison](../../../artifacts/phase-3/comparisons/ideas-empty-mobile-comparison.png), [Idea detail at 320px](../../../artifacts/phase-3/idea-detail-mobile-readable-actions.png), and the refreshed [selected Idea detail comparisons](../../../artifacts/phase-3/comparisons/idea-detail-empty-mobile-comparison.png) and measurement JSON. Production build passed; TypeScript passed through the build. Focused ESLint reported 0 errors and 2 Home hook dependency warnings. The focused Home/detail Playwright test passed 1/1 after the final build; the Idea detail Stitch comparison passed 1/1. The empty/error collection test passed once before the final rebuild, then timed out at 45 seconds during its recovery-state portion; the long combined collection source-capture test lost its loopback server during populated-state navigation. The latest Node run passed 33/34: a stale Home test expects three visible Idea links although this composition renders the newest one; the test shim was updated to recognize the existing Radix Dialog and Motion APIs. `git diff --check` passed. These verification limits do not indicate a regression from the four presentation corrections. No persistence, dependency, backend or user-data changes were made.
