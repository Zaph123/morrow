# Home, Ideas and Library stabilization

**Evidence cleanup (2026-11-27):** Generated app screenshots and comparison images were deleted per request. Original Stitch PNG/HTML sources under `artifacts/references/stitch/` remain the design targets. Screenshot labels below identify removed verification output; browser tests can regenerate local captures.

27 November 2026. Status: bounded implementation and verification complete. The user accepted the loading-state correction; that work is closed unless a new issue is raised. Broader Home, Ideas and Library visual review remains separate, and Ideas populated-mobile source fidelity is still blocked. The user confirms Vercel builds successfully after the earlier Node-removal type fix. This local slice does not deploy, commit, push or start Studio conversion.

## Loading-state visual acceptance (27 November 2026)

The user reviewed and accepted the loading-state changes. Do not reopen this slice without a new issue. This acceptance is specific to the loading states and does not sign off the full Home, Ideas or Library screens.

The accepted comparison and transition evidence is recorded in `artifacts/phase-3/comparisons/`: desktop and mobile Home, Ideas and Library loading comparisons and measurements, plus `loading-transitions.json`. The final geometry uses four varied collection skeleton rows; Library's populated row geometry is 108px desktop / 128px mobile, populated Ideas desktop rows are 108px, and mobile Ideas can grow to fit its longer content. Persistent headings remained at y=64 mobile / y=128 desktop; empty-state controls disappear as expected after a successful empty read. Home capture remained usable while recent-work loading was independently held, and a successful save refreshed the cards. Loading announcements were checked for duplication; action feedback remains tied to actual actions.

Verification already completed for this slice: the maintained Node suite passed 34/34, production build and standalone TypeScript passed, focused lint reported zero errors with two existing Home dependency warnings, and targeted Edge transition verification passed after correcting the test assertion. The stabilization report records the broader Edge outcomes, screenshots, exact measurement limitations and pre-existing full-lint failures. There is no dedicated selected Home loading reference; the approved compact Home layout governs. The Ideas populated-mobile original remains unusable (incomplete PNG and CDN-blocked HTML); this does not invalidate loading-state acceptance. No screen-reader audit or physical-device certification is claimed. These limitations remain documentation, not reopened work.

## Governing decisions recorded before comparison

Original Stitch sources and their HTML remain under `artifacts/references/stitch/`; app captures remain evidence. The canonical 201-file integrity manifest remains authoritative. Later explicit Home decisions override the older export: compact auto-growing composer with identical focused appearance; one recent record per relevant card; two-line visual previews; white hover fill and semantic neutral border; visible in-header View all links; desktop 16px group inset; native mobile horizontal rail with next-card preview; Blank draft first when writing is empty; no 212px fixed height; no Add context or real identity. Fixed mobile navigation, existing icons and the supplied Brain asset remain. These are existing approvals, not new exceptions inferred from screenshots.

Ideas retains the approved responsive capture interaction, real legacy handlers, segmented real filter values and source-based empty/list layouts. Library retains real `ready`/draft/published statuses and Studio reopen links; exported independent platform versions are deferred. Sidebar remains 240px/72px with the existing omissions. No storage/schema/ID/formatter/migration/dependency/backend changes are authorized.

## Selected reference matrix

All source directories below are relative to `artifacts/references/stitch/`; each supplies `screen.png` and `code.html`. PNG physical sizes are normalized to the established CSS viewport (desktop 1600x1280 originals at 1.25 scale; mobile 706x1600 originals at 2 scale), never compared as an unscaled thumbnail. App screenshots use zoom 100%, scroll top unless noted, and isolated synthetic local data.

| Route/state | Desktop source | Mobile source | CSS comparison viewport | Component |
| --- | --- | --- | --- | --- |
| Home populated | `source-b/reference-export/morrow_desktop_home_cards_centered_refined_radii` | `source-a/reference-export/morrow_mobile_home_cards_v5` | 1280x1024 / 353x800 | `components/home/home-page.tsx`, `horizontal-card-rail.tsx` |
| Home empty | `source-a/reference-export/morrow_desktop_home_empty_state` | No dedicated selected mobile-empty source; use the written empty-card contract | 1280x1024 / 330x609, 390x844, 450x900 | `components/home/home-page.tsx` |
| Ideas empty | `source-a/reference-export/ideas_desktop_empty` | `source-a/reference-export/ideas_mobile_empty` | 1280x1024 / 353x800 | `components/ideas/ideas-page.tsx` |
| Ideas populated | `source-a/reference-export/ideas_desktop_spacious_list` | `source-b/reference-export/ideas_mobile_list` | 1280x1024 / 353x800 | `components/ideas/ideas-page.tsx` |
| Library empty | `source-b/reference-export/library_desktop_empty` | `source-a/reference-export/library_mobile_empty` | 1280x1024 / 353x800 | `components/content/content-page.tsx` |
| Library populated | `source-b/reference-export/library_desktop_list` | `source-b/reference-export/library_mobile_list_revised` | 1280x1024 / 343x800 | `components/content/content-page.tsx` |

Ideas populated mobile has an incomplete original PNG. Its original HTML was already selected as the alternative, but its Tailwind CDN dependency is blocked in Edge. A bounded retry through the original CDN also returned HTTP 403. No replacement screen or unstyled source is accepted as a design target; that comparison remains explicitly limited.

## Findings and changes

- The Node controller harness now treats the approved rail as a presentation boundary; actual rail behavior is verified in Edge. The stale Home test now asserts the approved newest-record composition, and verifies both stored formats remain byte-for-byte unchanged. Stable sorter ties are still covered independently.
- The visible Ideas-card header action had been replaced with an absolutely positioned `.sr-only` label plus chevron. On a 390px viewport that label remained at x=563 and enlarged the document to 564px, despite the body/rail being clipped. Restoring the requested visible View all text removes that escaped absolute element. No save or navigation handler changed.
- Live reduced-motion coverage exposed a real rail defect: the installed Motion 14 hook initializes from a mount-time preference. The rail now reads the current preference at release and cancels active glide on a preference change. Native touch/trackpad behavior remains unchanged.
- Initial empty-state captures missed an SVG still loading. Computed styles and HTTP 200 confirmed the existing asset; decoding it before the next paint restored it in captures. This was verification timing, not missing application artwork. Comparisons now await fonts and decorative background SVGs.
- Browser assertions are updated from the superseded 192px minimum to the existing compact 144px minimum, with equal-height and two-line checks retained. Release sampling is captured in the browser at pointer-up and subsequent animation frames, so test-driver latency cannot label the settled position as release time. Temporary containment CSS and verbose DOM probes are removed from the motion test; the focused viewport test retains reversible snap/transform isolation and records its result.

## Actual verification

| Check | Actual result |
| --- | --- |
| Maintained Node regression suite | **34/34 passed** after the harness change, covering both stores, stable sorting, metadata, timestamps, save/retry and later dirty edits. |
| Full Home/Phase 2 Edge suite | **28/28 passed** before adding live reduced-motion coverage. |
| Final focused Edge run after the rail fix | **4/4 passed**: long previews/full-text reopen; native touch and mouse click/drag; frame-sampled glide, reversal, both ends, wheel cancellation and live reduced motion; six viewport/clearance cases. |
| Full Phase 3 Edge suite | **21/23 passed**. Two deterministic stale assertions failed: selection `[3,21]` versus `[0,0]` after the simplified wrapper remount, and counting Close as a third footer action. |
| Targeted Phase 3 rerun | **4/4 passed**: collection comparisons, new Home comparisons, draft/focus retention and device-toolbar action rows. This is not a claimed single full 24/24 run. |
| Production build after final application change | **Passed**, including TypeScript and static generation. |
| Final standalone TypeScript | **Passed**. |
| Focused ESLint on all changed TS/JS modules | **0 errors; 2 pre-existing Home warnings** for `syncComposerHeight` effect dependencies at lines 147 and 163. |
| Full ESLint | **20 existing errors; 2 Home warnings**. CommonJS `no-require-imports`: Cursor hook 6, Trail hook 6, Trail statusline 5, historical inspect script 1, `verifications/now-line-clamp.js` 2. No blanket suppression. |

All browser runs used installed Edge, isolated contexts and synthetic data; each runner exited and tore down its own loopback server normally. No personal session was used. Earlier failures are reported rather than called flaky. The newly added live-preference test first failed with 100px at release and 173px settled; it passed after the rail fix.

The responsive wrapper remains the existing breakpoint-only composition. The resize test verifies draft retention and usable focus, without restoring selection snapshots deliberately removed from that wrapper. The confirmation test measures `.morrow-dialog-actions`; its accessible Close button remains available.

## Gap, sizing and motion evidence

[Viewport measurements](../../../artifacts/stabilization/home-viewport-measurements.json) separate initial position from bottom-of-page clearance. Composer-to-rail spacing is **24px** and the nav bottom inset is **16px**. Every document width equals its viewport. Temporarily disabling snap and card transforms changes neither geometry nor vertical gap.

| CSS viewport | Empty height / initial gap above nav | Populated height / initial gap | Clearance after scrolling |
| --- | --- | --- | --- |
| 330x609 | 144px / -5px | 187.5px / -48.5px | 36px empty / 36.5px populated |
| 390x844 | 144px / 230px | 187.5px / 186.5px | Same; no vertical scroll needed |
| 450x900 | 144px / 286px | 187.5px / 242.5px | Same; no vertical scroll needed |

Negative initial gaps on short screens mean the fixed nav overlaps the lower region until scrolling; the bottom clearance is verified. Large positive gaps on taller screens are unused viewport space above fixed navigation, not extra rail padding or snapping. Cards and navigation were not stretched to hide it. The selected short-screen captures now use exact viewport screenshots at the scrolled position.

[Motion samples](../../../artifacts/stabilization/home-rail-motion-samples.json) record pointer-up positions and subsequent browser frames. In the final run, fast and slower inputs both went from 120px to 144px (the existing minimum glide); a preceding run observed 28px versus 24px glide. This verifies actual motion under different input timing, not a calibrated speed curve or a screenshot-based fluidity claim. Reversal went 54px to 28px; the right end reached exactly 522px of 522px, and the left end reached 0. Wheel input canceled the animation. Live reduced-motion activation canceled it; the following reduced-motion drag stayed at 100px with zero glide.

At 320px and 1280px, long previews compute two lines at 22.75px line height and 45.5px rendered height, with hidden overflow, normal white space, zero minimum width and no flex growth. Opening either item shows its complete saved paragraphs. The 720px desktop composer has a 688px rail inset 16px per side; at 353px both are 305px wide with 24px gutters.

## Source comparisons and measured fidelity

Source is left and app is right. Source PNGs are normalized to the established matching CSS viewport, not compared as thumbnails. Dates, real supported status/platform/source metadata and the approved shared shell are preserved. Home's later written decisions govern its compact composer, header links and mobile rail.

- Home: populated desktop (generated screenshot removed per request), populated mobile (generated screenshot removed per request), empty desktop (generated screenshot removed per request), [measurements](../../../artifacts/phase-3/comparisons/home-stabilization-measurements.json).
- Ideas: empty desktop (generated screenshot removed per request), empty mobile (generated screenshot removed per request), populated desktop (generated screenshot removed per request), mobile app output (generated screenshot removed per request), [source blocker](../../../artifacts/phase-3/comparisons/ideas-mobile-source-render-status.md).
- Library: empty desktop (generated screenshot removed per request), empty mobile (generated screenshot removed per request), populated desktop (generated screenshot removed per request), populated mobile (generated screenshot removed per request).
- Short/tall Home: 330 empty (generated screenshot removed per request), 330 populated (generated screenshot removed per request), 390 empty (generated screenshot removed per request), 390 populated (generated screenshot removed per request), 450 empty (generated screenshot removed per request), 450 populated (generated screenshot removed per request).

Each collection comparison also has `<name>-measurements.json` beside it. Actual collections measure 760px desktop, 305px at the 353px mobile empty viewport and 295px at the 343px Library list viewport, with 24px mobile gutters. Search is 40px high; the first populated row is 108px desktop and 128px mobile Library. Empty mobile artwork has a 96x96px pseudo-element; its supplied SVG is not pixel-identical to the mobile prototype glyph.

Scores use L/T/C/S/I = layout 30, typography/spacing 25, surfaces 20, states 15, icons/details 10. They are evidence-backed engineering judgment, not pixel similarity or user acceptance. Extra responsive Home widths use written fluid geometry and shared visual roles, not a falsely scaled reference PNG. The category-specific purple/ochre/teal icon and heading direction is now an approved revision to the source treatment; it is not a fidelity deduction. Review of the actual rendered shades remains open, so this direction does not accept their exact values.

| State / CSS viewport | L/T/C/S/I | Total | Remaining difference |
| --- | --- | ---: | --- |
| Home populated 1280x1024 | 29/24/17/14/10 | 94 | Existing colored accents; small text-wrap, rhythm and control differences. |
| Home populated 353x800 | 28/24/17/14/9 | 92 | Same accents and supporting text/icon differences; the approved rail replaces the stacked export. |
| Home empty 1280x1024 | 29/24/17/14/10 | 94 | Existing blank-card accent and small type/control differences. |
| Home 320x844 | 28/24/17/14/9 | 92 | Common accents/details; narrow previews stay clamped and reopen fully. |
| Home 330x609 | 28/24/17/14/9 | 92 | Same accents; scroll is required and verified for fixed-nav clearance. |
| Home 390x844 | 28/24/17/14/9 | 92 | Same accents; unused vertical space follows the fixed-nav decision. |
| Home 450x900 | 28/24/17/14/9 | 92 | Same accents/details; no page-width overflow. |
| Home 768x844 | 28/24/17/14/9 | 92 | Narrow content beside the sidebar uses the approved overflow rail. |
| Home 1024x844 | 28/24/17/14/9 | 92 | Same rail, accents and small type/detail differences. |
| Home 1440x844 | 29/24/17/14/10 | 94 | Equal columns/inset verified; same common accents/details. |
| Ideas empty 1280x1024 | 28/23/20/14/9 | 94 | Small title/state rhythm differences. |
| Ideas empty 353x800 | 27/23/20/14/7 | 91 | Copy about one line higher; desktop-family SVG differs from single-sheet mobile glyph; central button omits extra plus. |
| Ideas populated 1280x1024 | 28/23/20/14/9 | 94 | Slight row/filter rhythm and icon differences; real relationships retained. |
| Ideas populated 353x800 | Not scored | Blocked | Original PNG incomplete; source HTML styling remains blocked by CDN access. Mobile functional checks do not establish fidelity. |
| Library empty 1280x1024 | 28/23/20/14/9 | 94 | Small state/control rhythm differences. |
| Library empty 353x800 | 27/23/20/14/7 | 91 | Copy about one line higher; artwork proportions/action arrow differ. |
| Library populated 1280x1024 | 28/23/20/14/9 | 94 | Slight row/filter rhythm and icons; real Ready status and legacy metadata are preserved. |
| Library populated 343x800 | 27/23/20/14/8 | 92 | Narrow metadata wrapping/row rhythm differ; statuses and actions remain usable. |

No scored row has a major clipping, inaccessible-action or data-loss mismatch. The blocked row prevents an overall visual-completion claim. User visual sign-off remains outstanding.

## Existing-component checklist

- [x] Reuse: existing Morrow buttons and approved UIArc filters/dialog/sheet/confirmation/toast/Copy/breadcrumb compositions; no new component or dependency.
- [x] Tokens/type: current Morrow DM Sans/weight rules override stock Arc defaults; only the requested visible View all text changed. Existing accent deviation is disclosed.
- [x] Layout/states: compact equal cards, native responsive overflow and real empty/error/no-results/dirty/retry feedback; no fake controls or success.
- [x] Motion/React: one cancellable Motion scroll owner, live reduced motion, no new render-time browser reads; capture state stays with its caller.
- [x] Keyboard/responsive: existing focus, labels, rail reveal, dismiss guards, focus return, tooltips and clipboard outcomes tested. Light-only policy and stored preferences preserved.
- [ ] Complete visual acceptance: blocked mobile Ideas source comparison and user sign-off remain. No screen-reader audit, dark-design verification or real-device certification is claimed.

## Files, remaining issues and boundary

Application changes: `components/home/home-page.tsx` (visible View all) and `components/home/horizontal-card-rail.tsx` (live reduced motion). Test changes: `scripts/helpers/local-runtime.mjs`, `scripts/test-sort.mjs`, `tests/browser/phase-2.spec.ts`, `tests/browser/phase-3.spec.ts`. Guidance: root `DESIGN.md`, current `DESIGN-DECISIONS.txt`, this report and cross-links from the prior Phase 3/capture reports. Selected PNG/JSON evidence is retained by `artifacts/.gitignore`.

Ideas/Library application compositions, navigation, composer saving, both persistence paths, IDs, metadata, font assets/licenses and dependencies were preserved. Remaining limitations: the Ideas mobile source blocker, existing full-lint errors/warnings, minor visual differences above and user visual approval. No attachments, Studio/Brand Brain/You conversion, migration, backend, new dependency, commit, push or deployment was performed. Stop for review; do not start Phase 4.
