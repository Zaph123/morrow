# Phase 4 report: Studio writing surfaces

**Evidence cleanup (2026-11-27):** Generated app screenshots and comparison images were deleted per request. Original Stitch PNG/HTML sources under `artifacts/references/stitch/` remain the design targets. Screenshot labels below identify removed verification output; browser tests can regenerate local captures.

**Status:** The editor-only implementation and the subsequent Studio start/resume correction are implemented and presented for visual review. Visual acceptance is pending; this report does not mark the screens accepted.

## What changed

Both editor families share the `WritingSurface` presentation while keeping loading, source resolution, feature state and mutations in their existing controllers. `/studio` now opens the reference-based Studio start/resume screen; `/studio/new` opens the legacy blank editor. Existing `/studio?contentId=…` and `/studio?sourceIdeaId=…` links still open their same editors. Home and legacy Library use `/studio/new` for a blank Studio draft. Ideas and existing draft callers retain their query links. Workspace blank, idea-seeded and reopen flows remain on their existing routes and repository. Routes, IDs, status/platform contracts, timestamps, metadata, retry behavior and source links remain intact. No AI, publishing, authentication or multi-platform-version behavior was added.

The shared surface uses existing Base UI input/select/textarea/button primitives, the reviewed Arc breadcrumb and real Copy button, and the existing SaveStatus. The native platform select remains in place under the documented UIArc review because each store supports one optional platform. Loading uses content-shaped skeletons for both the editor and Studio start page. The writing surface is now 704px max width, with a 296px desktop and 272px mobile minimum writing card, bringing the writing area closer to the source proportions. The start page shows one newest legacy Studio draft for resume and does not combine workspace records. The seed controller uses render-safe state, and the component test runtime models the shared presentation imports and `useId`.

## Reference comparisons

Original Stitch PNGs and HTML remain the targets. The recorded comparisons used matching CSS viewport dimensions. Generated app captures and comparison composites have since been removed; the source PNG/HTML and measurement JSON remain. App captures are verification output, not design targets.

| State and viewport | Original Stitch source | Comparison evidence |
| --- | --- | --- |
| Studio start/resume, 1280×1024 | [`studio_desktop_start_refined` PNG](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_start_refined/screen.png) · [HTML](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_start_refined/code.html) | Comparison (generated screenshot removed per request) · app output (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-start-desktop-measurements.json) |
| Studio start/resume, 390×844 | [`studio_mobile_start` PNG](../../../artifacts/references/stitch/source-a/reference-export/studio_mobile_start/screen.png) · [HTML](../../../artifacts/references/stitch/source-a/reference-export/studio_mobile_start/code.html) | Comparison (generated screenshot removed per request) · app output (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-start-mobile-measurements.json) |
| Legacy blank draft at `/studio/new`, 1280×1024 | [`studio_desktop_blank_draft` PNG](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_blank_draft/screen.png) · [HTML](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_blank_draft/code.html) | Comparison (generated screenshot removed per request) · app output (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-blank-desktop-measurements.json) |
| Legacy idea-seeded editor, 390×844 | [`studio_mobile_write` PNG](../../../artifacts/references/stitch/source-b/reference-export/studio_mobile_write/screen.png) · [HTML](../../../artifacts/references/stitch/source-b/reference-export/studio_mobile_write/code.html) | Comparison (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-idea-seeded-mobile-measurements.json) |
| Legacy save failure, 390×844 | Same mobile write source; there is no dedicated mobile failure reference | Comparison (generated screenshot removed per request) · app output (generated screenshot removed per request) |
| Workspace blank draft, 1280×1024 | Same selected desktop blank source | Comparison (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-workspace-blank-desktop-measurements.json) |
| Workspace idea-seeded/reopened, 390×844 | [`studio_mobile_write_after_accept` PNG](../../../artifacts/references/stitch/source-a/reference-export/studio_mobile_write_after_accept/screen.png) · [HTML](../../../artifacts/references/stitch/source-a/reference-export/studio_mobile_write_after_accept/code.html) | Comparison (generated screenshot removed per request) · app output (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-existing-mobile-measurements.json) |
| Workspace existing editor, 1280×1024 | [`studio_desktop_canonical` PNG](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_canonical/screen.png) · [HTML](../../../artifacts/references/stitch/source-b/reference-export/studio_desktop_canonical/code.html) | Comparison (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-workspace-existing-desktop-measurements.json) |
| Legacy existing editor, 1280×1024 | Same selected canonical desktop source | Comparison (generated screenshot removed per request) · [bounds/styles](../../../artifacts/phase-4/studio-existing-desktop-measurements.json) |

The initial Phase 4 comparison exposed a compressed editor card and, more significantly, the absence of the Studio entrance screen. The follow-up correction widens the editor to 704px and sets its desktop minimum card height to 296px, close to the selected blank-draft source proportions. The final mobile editor card measures 342×272 at x=24px/y=196px; hiding the inherited mobile top bar on Studio routes brings the editor closer to the source's vertical composition. Long text remains in the actual textarea and scrolls independently of the footer.

The new Studio start page measures 928px wide at desktop and stacks at 390px mobile. In the mobile comparison, the “Studio” heading and main hero align closely with the source after removing the extra global top bar. The desktop main-column and Resume card widths align with the selected two-column reference. The real Resume record is synthetic and comes only from `morrow:content`; the workspace store is deliberately not combined. The “Discuss a thought” row remains non-interactive and says AI discussion is unavailable. Its decorative folded-paper and overlapping-message illustrations now follow the selected Stitch source, with semantic mint and peach badge tokens. Remaining differences include explicit helper copy and a trailing arrow for “From an idea,” and a truthful unavailable-AI status note instead of an active Discuss action. These are documented behavior/content exceptions, not claims of pixel identity.

Studio routes now omit the inherited mobile top bar to match the selected Studio compositions; the start page keeps the selected mobile bottom navigation, while editor routes hide it for writing focus. Morrow retains its approved 24px mobile page inset while the editor export uses about 16px. There is no separate blank mobile editor source; populated mobile is only geometry guidance for the blank state. No dedicated mobile failure source exists, so that screenshot is paired with the normal write screen only as context, not as an error-state match.

The accepted AI exception remains significant: canonical desktop sources have a Discuss dock; mobile has Write/Discuss tabs; the export also implies multiple platform versions. Those editor surfaces remain omitted because there is no configured AI provider or Discuss interaction, and each current record supports one platform. The start page retains the reference's Discuss position only as a non-interactive, clearly unavailable state. No fake responses were added. Editors retain explicit local Save controls, and the existing workspace delete-draft section remains below its writing surface.

Earlier provisional editor scores (91 desktop blank, 90 desktop populated and 88 mobile populated) predate this correction. They remain historical estimates only; this report does not carry them forward as current scores or user acceptance. The updated comparisons and bounds are available for review, and visual acceptance remains pending.

## Verification

- Maintained Node regression suite: **34/34 passed**, including save/retry, later-edits-remain-dirty, storage protections, metadata and store separation.
- Phase 4 Playwright on installed Edge (`msedge`), isolated contexts and synthetic data: **7/7 passed, 0 flaky** after the start-page correction. Coverage includes desktop/mobile Studio start and resume, mobile navigation and blank-editor entry, Home and Ideas entry points, blank and idea-seeded creation in both stores, Library reopen, failed-save recovery, full long text, source-missing behavior, store separation, and `createdAt`/`updatedAt`/source metadata.
- TypeScript: `pnpm.cmd exec tsc --noEmit` passed; production build's TypeScript step passed.
- Focused ESLint on changed editor, helper, route and browser-test files: **0 errors**. It reports two existing hook-dependency warnings in `components/home/home-page.tsx` at lines 147 and 163; this Studio correction did not change those effects.
- `pnpm.cmd build`: passed.
- `git diff --check`: passed; only existing CRLF normalization notices were printed.
- Raw browser run: [results.json](../../../artifacts/phase-4/results.json).

No artificial loading or saving delay was added. No provider/backend call, migration, dependency, commit or deployment occurred. The user's loading-state acceptance remains documented in [STABILIZATION-REPORT.md](STABILIZATION-REPORT.md) and is not reopened.

## Changed files in this phase

- `components/studio/writing-surface.tsx`
- `components/studio/studio-page.tsx`
- `components/studio/studio-start-page.tsx`
- `app/globals.css` (Studio start option illustration tokens and sizing)
- `components/content/content-editor.tsx`
- `app/(workspace)/studio/page.tsx`
- `app/(workspace)/studio/new/page.tsx`
- `app/(workspace)/content/new/page.tsx`
- `app/(workspace)/content/[id]/page.tsx`
- `components/layout/mobile-nav.tsx` (Studio-only top-bar omission; the Studio start page retains mobile navigation)
- `components/home/home-page.tsx`, `components/content/content-page.tsx` (blank Studio draft links)
- `app/globals.css`
- `DESIGN.md` (records Home's approved accent direction while leaving exact shades open for review)
- `tests/browser/phase-4.spec.ts`
- `scripts/test-editor-saving.mjs`, `scripts/helpers/local-runtime.mjs` (component-test route and formatter mocks)
- `playwright.config.ts`
- `scripts/helpers/local-runtime.mjs`
- `artifacts/.gitignore`
- `docs/handoff/2026-11-24/PHASE-4-PROPOSAL.md`, `STABILIZATION-REPORT.md` (records accepted loading work), and this report

Unrelated work and original Stitch sources were preserved. Review the new start page, revised editor proportions, and remaining documented differences before recording visual acceptance. Studio AI, multi-version persistence, Supabase/provider integration and other deferred features remain outside this phase.
