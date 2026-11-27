# Phase 4 proposal: Studio writing surfaces

Status: editor conversion was approved and implemented on 27 November 2026. A subsequent user correction adds the selected Studio start/resume surface and an editor-only route at `/studio/new`; this correction is implemented and awaiting visual review. See [the Phase 4 report](PHASE-4-REPORT.md).

## Recommended scope and sequence

Convert the existing manual-writing surfaces for desktop and mobile while preserving each route's current persistence contract:

1. Keep `/studio` as the Studio start/resume surface. Open the legacy blank editor at `/studio/new`; preserve existing `sourceIdeaId` and `contentId` deep links and their `lib/storage.ts` handlers.
2. Restyle the workspace editors at `/content/new` and `/content/[id]`, including `?from=` idea development, using their existing `use-workspace` hooks and `lib/workspace/repository.ts` handlers.
3. Align loading, missing-source, missing-draft, dirty/saved, save-failure/retry and source-relationship presentation with the corresponding editor layout. Keep saving and validation logic in each current caller.
4. Verify the two route families independently at matched desktop/mobile viewports with synthetic data and the original Stitch files. Do not infer completion from route smoke tests.

This phase does not merge the two editors or stores. Home's Blank draft and the legacy Library's New draft action use `/studio/new`; Ideas development and existing legacy draft links retain `/studio?sourceIdeaId=…` and `/studio?contentId=…`. The workspace content list continues to open `/content/[id]`.

## Live routes, records and boundaries

| Route and state | Current implementation | Persistence and behavior to preserve |
| --- | --- | --- |
| `/studio` start/resume | `app/(workspace)/studio/page.tsx`, `components/studio/studio-start-page.tsx` | Lists only legacy Studio drafts; no store merge. Blank writing opens `/studio/new`. |
| `/studio/new` blank editor | `app/(workspace)/studio/new/page.tsx`, `components/studio/studio-page.tsx` | Legacy `lib/storage.ts`; optional title/body/platform; new legacy content ID on save. |
| `/studio?sourceIdeaId=…` develop an idea | `components/studio/studio-page.tsx`; entered from `components/ideas/idea-detail.tsx` | Loads the legacy idea, seeds its text into the editor, and stores the original `sourceIdeaId` on the new draft. Editing the draft never mutates the idea. |
| `/studio?contentId=…` reopen/edit | `components/studio/studio-page.tsx`; linked from Home, Ideas detail and legacy Library | Reads and updates the same legacy record. Keep its ID, status, platform, source relationship, `createdAt`, and mutation-only `updatedAt`. Missing source must not make the draft unavailable. |
| `/content/new` blank or `?from=…` | `app/(workspace)/content/new/page.tsx`, `components/content/content-editor.tsx` | Workspace repository/hooks. Blank creation and idea-seeded creation retain workspace IDs, title derivation, platform and `sourceIdeaId` behavior. A source read error/missing source remains distinct from blank creation. |
| `/content/[id]` edit | `app/(workspace)/content/[id]/page.tsx`, `components/content/content-editor.tsx` | Workspace repository/hooks. Preserve update/delete behavior, error retention, source-missing state and draft-only status. |

### Data and functional boundary

Both active models already persist one nullable platform value per content item and an optional `sourceIdeaId`. The legacy model uses `whatsapp-status`; the workspace model uses `whatsapp`. Preserve each enum, serializer, ID generator, status, timestamps, title behavior, validation and handler. Do not normalize values, copy records between stores, change routes to switch stores, or add platform-version records. The X/LinkedIn chips and plus control in the export imply multiple versions; this phase will not reproduce their multi-version behavior. Keep the current single-platform selection in each editor and label it truthfully.

Keep manual title/body editing and local save available without AI. There is no configured provider in these editor routes. Do not add generation, authentication, publishing, server calls or an interactive Discuss composer. Show no fake pending/success state. Treat the unconfigured-AI condition as a truthful non-interactive availability state (or omit an AI entry point when no AI surface is present); any new actionable Discuss interaction returns for separate review. Preserve the existing deletion confirmation and result handling without redesigning its behavior.

## Original Stitch mapping

Paths are relative to `artifacts/references/stitch/`. The selected targets are the original catalogue sources, not screenshots from `artifacts/`. “Corrections” below are intentional differences from export behavior.

| Route/state | Desktop PNG / HTML | Mobile PNG / HTML | Written corrections and source coverage | Likely implementing component | Status before this phase |
| --- | --- | --- | --- | --- | --- |
| `/studio` start and resume | `source-b/reference-export/studio_desktop_start_refined/screen.png` / `code.html` | `source-a/reference-export/studio_mobile_start/screen.png` / `code.html` | Keep Start writing and From an idea. Discuss is a non-interactive, clearly unavailable AI state. Resume reads only legacy Studio drafts; no cross-store aggregation. | `components/studio/studio-start-page.tsx` | Awaiting conversion at the user's correction. |
| `/studio/new` blank writing surface | `source-b/reference-export/studio_desktop_blank_draft/screen.png` / `code.html` | `source-b/reference-export/studio_mobile_write/screen.png` / `code.html` | Keep the real editor and save controls. The mobile source shows populated writing, not a distinct blank state; use its layout with empty body and document this comparison limitation. | `components/studio/studio-page.tsx` | Partially converted; current editor works but does not follow the selected layout. |
| Develop existing idea | `source-b/reference-export/studio_desktop_canonical/screen.png` / `code.html` | `source-b/reference-export/studio_mobile_write/screen.png` / `code.html` | Retain a truthful source-idea reference and link. Omit AI-generated proposal/highlight content and Discuss controls; those are not creator-authored text or available functionality. | `components/studio/studio-page.tsx` | Partially converted. |
| Open/edit existing draft | `source-b/reference-export/studio_desktop_canonical/screen.png` / `code.html` | `source-b/reference-export/studio_mobile_write_after_accept/screen.png` / `code.html` | Preserve editable full text and current route/store binding. The mobile source includes accepted proposal styling; do not copy that treatment into creator content. | `components/studio/studio-page.tsx`; `components/content/content-editor.tsx` | Partially converted. |
| Save failure and retry | `source-b/reference-export/studio_desktop_couldn_t_save/screen.png` / `code.html` | No dedicated mobile failure reference; use `studio_mobile_write` as the layout basis. | Use its truthful unsaved/save-retry state, not historical `studio_desktop_save_error`, whose obsolete device-backup claim conflicts with current persistence truth. Do not delay synchronous local writes to make “Saving” visible. | Both editor components and existing status/error components | Partially converted. |
| Blank/empty Library entry versus editor | `source-b/reference-export/studio_desktop_blank_draft/screen.png` / `code.html` | `source-b/reference-export/studio_mobile_write/screen.png` / `code.html` | “No draft body yet” is an editable blank editor, not an empty-collection screen. Keep the actual collection-empty state on Library. | Both editor components | Partially converted. |
| Loading, read failure, missing draft/source | No dedicated Studio loading or read-failure reference. Use the blank/canonical editor PNGs only to match the destination geometry. | No dedicated mobile loading or read-failure reference. Use `studio_mobile_write` only as the destination geometry. | Keep retry and unavailable-record states distinct. Do not flash a successful empty editor before reads finish. Do not score the invented loading state against an absent source. | Both editor components; existing route Suspense fallbacks | Partially converted. |
| AI unconfigured | No selected unconfigured-AI PNG/HTML. `studio_desktop_discuss_closed` is an available-feature control state, not an unconfigured state, so it is not a target. | No selected unconfigured-AI PNG/HTML. `studio_mobile_discuss` assumes a functioning Discuss workflow, so it is not a target. | No chat/send affordance or fake response. If a passive state is needed in the layout, state plainly that AI is not configured and manual writing remains available. | Existing editor composition; reuse an existing neutral placeholder if needed | Awaiting conversion. |
| Studio entrance / resume landing | `source-b/reference-export/studio_desktop_start_refined/screen.png` / `code.html` | `source-a/reference-export/studio_mobile_start/screen.png` / `code.html` | These sources depict a distinct landing page with Start writing, From an idea, Discuss a thought and Resume. The live `/studio` route is an editor, not this landing page. Exclude this separate landing route and resume-card conversion from the recommended scope. | No component proposed in this phase | Awaiting conversion; route mismatch. |

The two `morrow_desktop_studio*` entries are catalogued historical designs. The `morrow_studio_save_states` image is a supporting overview rather than a route target. `studio_desktop_context_open_refined_radii` depicts the idea-detail Context popover, not the Studio writer, and is excluded. Keep all original sources and classifications unchanged. Existing app screenshots are regression/comparison evidence only.

## Components and review

Reuse `components/ui/button.tsx`, `input.tsx`, `select.tsx`, and `textarea.tsx`; the existing `SaveStatus`, `components/layout/loading-skeletons.tsx` patterns where structurally suitable, and the current `SourceIdeaPanel`/source reference. Keep persistence and feature state in their current Studio/content callers. Use the existing app shell and current Morrow tokens/DM Sans.

For breadcrumb needs, reuse the already reviewed `components/arc/breadcrumb/breadcrumb.tsx` API (`items`, `ariaLabel`) adapted to Next links, if it fits the final hierarchy. The installed `components/arc/copy-button/copy-button.tsx` already provides real clipboard success/failure; use it only where the selected screen has a useful copy action and never to imply unsaved text is saved. Do not add dependencies or import Arc foundation CSS. The existing `Select` remains the preferred selector because this phase preserves one optional platform value; the export's multi-platform segmented treatment would change the product contract. No new segmented control, menu, dialog, shared interaction, or component is proposed.

### Platform selector review

The current `components/ui/select.tsx` is a labelled native `<select>` styled through Morrow's existing field classes. Its existing callers provide the four options already supported by each store (none plus three platforms), and it retains native keyboard, focus and mobile-picker behavior. The selected blank-draft Stitch source also uses a compact “Choose platform” dropdown. The UIArc catalog was checked: its free Select is a Radix-based short-list control with typeahead, arrow-key selection, Escape close, reduced-motion handling and responsive scrolling; its published install adds `@radix-ui/react-select`, `motion`, and `lucide-react`. UIArc Radio Group is designed for visible 2–6-option choices and native-radio arrow navigation, which does not match the selected compact dropdown. The present Morrow select already meets this screen's behavior and reference; keep it, do not add a dependency or replace it for visual variety. This is a reviewed reuse decision under the repository's component policy, not a new selector implementation. If selector interaction changes later, inspect the chosen component's actual source and license before implementation. Catalog references: [UIArc Select](https://uiarc.dev/components/select), [UIArc Radio Group](https://uiarc.dev/components/radio-group).

### Explicit unavailable-AI layout exceptions

The selected desktop blank/canonical Studio designs reserve top-bar space for Discuss; the open canonical design adds a full-height right dock, and the mobile write designs add a Write/Discuss switch. These are significant layout differences from this manual-first phase. There is no configured AI provider or live Discuss controller in the inspected routes, so omit the Discuss action, dock, mobile tab, prompt composer, generated proposal/highlights, suggestion list and “Discuss a thought” entry point. Let the manual editor use the available width. Keep Copy as a real clipboard action, and keep the source-idea relationship visible. Do not render disabled-looking fake AI controls or fabricate a response. This is a bounded, explicit exception; no Studio AI feature is being represented as implemented.

## Acceptance criteria

- Blank, source-idea and existing-draft routes render responsive desktop and mobile editor layouts from the mapped sources; compare original Stitch PNG/HTML next to actual output at matching CSS viewports and content states.
- Each existing entry point opens the same store and record it opens today. `sourceIdeaId`, IDs, full body, title/status/platform values, creation time and mutation-only update time remain protected in both stores.
- The idea relationship is visible and navigable; editing draft text/platform/title leaves its source idea unchanged. A missing/deleted source leaves the draft editable and communicates the unavailable relationship.
- Dirty/saved, save failure/retry, load failure/retry, missing record and blank body are distinct and truthful. Failed saves retain all entered text; a successful save changes only the existing mutation fields. Do not fabricate asynchronous loading/saving or AI results.
- Keyboard access, visible focus, textarea scrolling, mobile navigation clearance and responsive source-panel behavior are verified. Screen-reader status is concise and nonduplicated; errors remain actionable.
- No multi-platform version UI or persisted version data appears. Unsupported AI, authentication, publishing and attachment controls remain absent or clearly non-interactive.
- Run the maintained storage/regression suite, TypeScript, focused lint, production build, diff checks and isolated Edge Playwright coverage for both stores, all entry points, long text, dirty/save/retry/error states, relationship preservation, mobile and desktop layouts. Record actual comparisons, computed geometry, gaps and status without claiming success from smoke tests.

## Presentation versus contract changes

**Included if approved:** layout, hierarchy, typography, responsive editor geometry, visible source attribution, loading/error/saved/dirty presentation and accessible control composition around the existing callers and handlers.

**Not included:** changing either persisted type, key, serializer, status/platform vocabulary, IDs, date rules or title derivation; moving records between the legacy and workspace stores; schema migration; platform versions; Supabase/provider AI, authentication, publishing, attachments, dependencies, deployment or unrelated screen redesign.

## Scope decision recorded

The original approval deferred the separate Studio landing/resume screen. The user's later correction requested that missing main Studio screen; it is now implemented at `/studio`, with the legacy blank editor moved to `/studio/new` and existing query-based editor links preserved. Visual acceptance remains pending review under the updated report.
