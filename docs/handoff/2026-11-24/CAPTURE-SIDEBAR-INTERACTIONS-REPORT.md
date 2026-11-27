# Capture and sidebar interactions

**Evidence cleanup (2026-11-27):** Generated app screenshots and comparison images were deleted per request. Original Stitch PNG/HTML sources under `artifacts/references/stitch/` remain the design targets. Screenshot labels below identify removed verification output; browser tests can regenerate local captures.

This approved interaction follow-up keeps the current route and both persistence formats. It uses the existing legacy idea writer and changes presentation and feedback only. Context attachments, Studio’s docked Discuss panel, backend work, migrations, and deployment remain outside scope.

## New idea

Sidebar, empty-state, and mobile heading entry points share one capture controller and one `ResponsiveDialogDrawer` presentation wrapper. It shows the inspected UIArc Dialog on desktop and Bottom Sheet on narrow screens. The sheet opens at its compact detent with capture actions visible, and retains its accessible grab/collapse handle and drag behavior. Text selection and textarea scrolling are left to the native textarea; pointer drags beginning in text inputs do not move the sheet.

The feature controller calls the existing `createIdea` handler. Success clears and closes the capture surface, refreshes the Ideas collection, and shows “Saved on this device” with a View idea action. A failed write keeps the dialog and text open with an inline actionable error. Close, Escape, outside press, and a drag-to-dismiss request all use the same dirty-state guard. Unsaved text is cleared only after explicit Discard; Keep editing returns focus to the textarea. Text, focus, and selection survive switching between desktop and mobile presentations.

## Feedback and deletion

One UIArc Toast Stack provider is mounted at the workspace shell. Local save success and idea deletion use this provider; validation and persistence failures remain beside their form. The mobile viewport sits above the bottom navigation with safe-area clearance.

Idea deletion uses the existing Base UI Alert Dialog primitive already present in the repository. “Delete idea?” explains that linked drafts remain available and provides Cancel and danger-styled Delete idea actions. A failed write retains the idea and confirmation with an inline retry. Success removes the idea through the existing handler, routes back to Ideas, and announces “Idea deleted.” The toast provider remains mounted during navigation. No Undo action was added.

## Sidebar

The desktop sidebar is 240px expanded and 72px collapsed. The existing route icons, active-route styling, New idea entry, and You destination remain. Collapsed controls have accessible names and hover/keyboard tooltips. The collapse preference uses the separate `morrow.ui.sidebar-collapsed` UI key. Its bootstrap script sets the document attribute before first paint; the React sidebar subscribes to the preference so hydration does not flash the expanded width. If browser storage is unavailable, the current tab still toggles in memory. The five-destination mobile navigation is unchanged.

## Components and dependency

- [UIArc Dialog](https://uiarc.dev/components/dialog), [Bottom Sheet](https://uiarc.dev/components/bottom-sheet), [Alert](https://uiarc.dev/components/alert), and [Toast Stack](https://uiarc.dev/components/toast-stack) were inspected at source level. Their adapted source retains the MIT attribution in the component files; token styling is scoped and mapped to Morrow’s existing light palette. Existing Motion and lucide dependencies are reused.
- `ResponsiveDialogDrawer` switches between the UIArc dialog and sheet presentation. It owns breakpoint selection and focus/selection restoration only; it has no save or domain state.
- Discard and delete decisions use the existing Base UI Alert Dialog primitive. The inspected UIArc Alert provides inline status styling, not a destructive confirmation interaction.
- The approved direct dependency `@radix-ui/react-dialog@^1.3.1` supplies the inspected UIArc Dialog and Bottom Sheet primitives. No other dependency was added.

## Browser evidence

The Playwright Edge suite used isolated contexts and synthetic records. The final run passed **15/15 tests**. It exercised capture from the Ideas empty state and sidebar, failed-save retry, save success, viewport changes with selection preservation, mobile textarea scrolling and touchmove pass-through, drag/Close/Escape/outside-press discard guards, deletion failure/retry, toast survival across navigation, route behavior at 320px/390px/768px/1024px/1440px, and Home focus appearance. The sidebar check verifies 240px/72px widths, active route, New idea, keyboard tooltip, persistence after reload, and unchanged mobile destinations.

Visual captures:

- Capture dialog and sheet: desktop dialog (generated screenshot removed per request), mobile sheet (generated screenshot removed per request), mobile writing (generated screenshot removed per request), discard guard (generated screenshot removed per request)
- Sidebar: expanded desktop (generated screenshot removed per request), collapsed desktop (generated screenshot removed per request), mobile navigation (generated screenshot removed per request)
- Failure feedback: delete retry state (generated screenshot removed per request), capture save retry state (generated screenshot removed per request)

`pnpm.cmd build` passed, including TypeScript. `node --test scripts/test-*.mjs` passed **34/34**. Focused ESLint passed for changed TypeScript/JavaScript modules. `git diff --check` passed. The final full browser run for the original interaction slice passed **15/15** tests. The isolated visual and keyboard checks do not constitute a screen-reader audit or real-device touch certification.

## Files changed in this follow-up

- `components/arc/dialog/dialog.tsx`, `components/arc/bottom-sheet/bottom-sheet.tsx`, `components/arc/alert/alert.tsx`, `components/arc/toast-stack/toast-stack.tsx`, `components/arc/UIARC-LICENSE.md`
- `components/ui/responsive-dialog-drawer.tsx`, `components/ideas/idea-capture-dialog.tsx`, `components/ideas/idea-capture-context.tsx`, `components/ideas/idea-detail.tsx`, `components/layout/workspace-shell.tsx`, `components/layout/app-sidebar.tsx`
- `lib/ui-preferences.ts`, `app/globals.css`, `package.json`, `pnpm-lock.yaml`
- `scripts/helpers/local-runtime.mjs`, `tests/browser/phase-3.spec.ts`
- Generated capture screenshots were removed on 2026-11-27; browser tests can regenerate them as local output, but they are not design references.

The initial interaction follow-up stops here for review. The bounded correction below records subsequent acceptance fixes; it does not begin another feature phase.

## Device-toolbar and visual-acceptance correction

The sheet starts at its compact detent at regular viewport heights. At heights up to 600 CSS pixels it starts at the tall detent, with its body scrollable, so the action footer can be brought into view without changing the capture controller. The short-height detent change preserves text, focus, and textarea selection as the viewport changes.

At 577×429 CSS pixels, the expanded sheet's capture action row measures 542px wide; Cancel and Save idea are 269px and 261px wide, with a 12px gap and 44px height. The initial body position placed them at y=487–531, outside that 429px viewport; scrolling the sheet body brought them to y=349–393, leaving 36px below the buttons. At 717×522, Cancel measures 79.75px and Save idea 88.98px, with 8px between; the buttons end at y=511, 11px above the viewport edge. Discard actions measure 116.55px and 84.38px, with a 12px gap. All buttons computed `flex-shrink: 0` and `white-space: nowrap`; none overlapped. The apparent shrink/clipping was the responsive switch to a bottom sheet plus the short-height, partial-detent body clipping, not the shared button primitive shrinking its labels.

The supplied red `N 1 Issue` is the Next.js development indicator. The existing server log identified its issue: Next blocked `/_next/hmr` when the page was opened as `127.0.0.1` while that server was bound to `localhost` (`allowedDevOrigins`). Opening the same synthetic page on `localhost` removed the warning and page-console errors; no indicator was hidden and no server configuration was changed. See [the origin diagnostic](../../../artifacts/phase-3/dev-origin-diagnostic.md), [diagnostic JSON](../../../artifacts/phase-3/dev-indicator-diagnostic.json), and screenshot (generated screenshot removed per request).

The selected `component_desktop_sidebar_you_active` source was compared with the actual You-route sidebar at 1280×1024. The fixed Morrow width remains 240px; the component region is normalized to the approved product width before the side-by-side comparison. Collapsed width remains 72px and is checked against the written requirement. The added pointer-only edge rail has a 6px target at the outside edge, uses the `ew-resize` cursor, and toggles the fixed widths; chevrons remain the keyboard/touch control. The rail is absent with the mobile navigation.

The UIArc Copy control's CSS-module measurement spans rendered visibly under this repository's global CSS handling. Its existing behavior and dependency were retained; its classes are now prefixed and styled in `app/globals.css`, and one responsive instance serves both mobile and desktop. Copy uses the displayed textarea value, reports clipboard success or failure, and does not affect save status. The visible measurement spans are verified hidden.

Updated comparison evidence includes expanded sidebar source/output (generated screenshot removed per request), linked detail desktop (generated screenshot removed per request), no-draft desktop (generated screenshot removed per request), linked detail mobile (generated screenshot removed per request), and no-draft mobile (generated screenshot removed per request). Device-toolbar captures are 577×429 capture (generated screenshot removed per request), 577×429 discard (generated screenshot removed per request), 717×522 capture (generated screenshot removed per request), and 717×522 discard (generated screenshot removed per request). Measurements are in the adjacent JSON files.

The final maintained regression suite passed **34/34**; the final Playwright Edge suite passed **21/21** in 4.2 minutes using isolated contexts and synthetic data. Build and standalone typecheck passed. Focused lint on changed modules passed. Full lint still reports 18 existing `@typescript-eslint/no-require-imports` errors in `.cursor/hooks/trail-hooks.cjs`, `.trail/hook.cjs`, `.trail/statusline.cjs`, and `artifacts/phase-2/inspect-development.cjs`. No dependency, persistence, or data-format changes were made.

## Device-toolbar root cause and final verification

The earlier diagnosis above missed a CSS selector collision. In `@media (pointer: coarse)`, `[data-slot="button"][class*="size-"]` also matched the shared button class because its SVG utility contains the literal `size-`. This forced text buttons to 44px and caused the label overlap in the supplied screenshot. The selector now targets only the actual `.size-8`, `.size-9`, `.size-10`, and `.size-11` icon-button utilities. Text buttons retain their intrinsic widths; no global button or expanded-state behavior changed.

The responsive wrapper selects the centered dialog for a viewport at least 768px wide or a fine hover pointer; otherwise it selects the bottom sheet. At 577x429, the fine-pointer dialog measures Cancel 79.75px and Save idea 88.98px, separated by 8px. The coarse-pointer sheet measures 269px and 261px with a 12px gap. At the inferred 620x522 app viewport inside the supplied 717px device-toolbar raster, the sheet measures x=22, y=156.61, width=576, height=525.39. After scrolling its footer into view, the actions end 36.39px above the viewport edge. The 577x429 sheet begins at y=128.70 and its action row ends 36.30px above the edge. Both rows remain within bounds. The 420px discard confirmation is centered at the inferred app viewport; its actions measure 116.55px and 84.38px with a 12px gap. Full element and viewport measurements are in [capture-action-measurements.json](../../../artifacts/phase-3/comparisons/capture-action-measurements.json); profile-specific screenshots sit beside it under `artifacts/phase-3/`.

After the final production rebuild, Playwright Edge passed **21/21** tests (4.7 minutes, exit code 0), including the corrected 620x522 sheet geometry, both collection hover routes, responsive selection preservation, mobile drag/discard guards, save retry, deletion recovery, focus return, sidebar controls and source comparisons. The maintained Node suite passed **34/34**; standalone TypeScript, production build and focused ESLint passed after the final test edits. Full `pnpm.cmd lint` exited 1 with **18** `@typescript-eslint/no-require-imports` errors in existing `.cursor/hooks/trail-hooks.cjs` (6), `.trail/hook.cjs` (6), `.trail/statusline.cjs` (5), and `artifacts/phase-2/inspect-development.cjs` (1). `git diff --check` passed with only CRLF notices. `trail.cmd build` refreshed the graph for 92 source files; no application dependency, persistence or data-format changes were made.

Use the profile-specific `device-toolbar-577-desktop-*`, `device-toolbar-577-mobile-*`, and `device-toolbar-620-mobile-*` captures generated by the final run; these supersede the earlier unprofiled filenames referenced above.

Final captures: 577x429 fine-pointer dialog (generated screenshot removed per request), 577x429 coarse-pointer sheet (generated screenshot removed per request), 577x429 discard guard (generated screenshot removed per request), 620x522 coarse-pointer sheet (generated screenshot removed per request), and 620x522 discard guard (generated screenshot removed per request). Row hover captures: Ideas linked drafts (generated screenshot removed per request) and Library collection (generated screenshot removed per request). Source comparisons are linked above.

## Visual acceptance ledger

These rubric scores are the engineering review for the requested corrections, using the documented 100-point categories and the linked output/reference evidence. They are not pixel-similarity claims or user sign-off. Deductions reflect visible deltas and the approved exceptions recorded above.

| Corrected screen/state and viewport | Score | Evidence and remaining difference |
| --- | ---: | --- |
| New idea, centered dialog, 577x429 fine pointer | 92/100 | 520px panel; 79.75px/88.98px actions and 8px gap. Compared with the supplied raster, panel top is 8px lower and 16px shorter. |
| New idea, short-height sheet, 577x429 coarse pointer | 94/100 | 576px sheet starts at y=128.70; 269px/261px action targets with 12px gap and 36.30px bottom inset after scrolling. Draft/focus behavior is covered. |
| New idea and discard guard, 620x522 coarse pointer | 94/100 | 576px sheet starts at y=156.61; action row has 12px gap and 36.39px bottom inset. Confirmation buttons remain 116.55px/84.38px and do not overlap. |
| Sidebar You selected, 1280x1024 | 94/100 | Source/output comparison confirms the 240px region, row alignment and selected treatment. Calendar and Sign out remain the recorded deferrals. |
| Sidebar collapsed, 1280x1024 | 93/100 | 72px rail, route state, tooltips, keyboard toggle and edge rail are verified; the collapse target is the approved written behavior rather than a separate Stitch export. |
| Idea detail with drafts, 1280x1024 and 639x1600 | 92/100 | Linked source/output comparisons and measured 700px desktop surface; textarea editing, truthful status, Copy and linked rows work. Add context stays deferred. |
| Idea detail without drafts, 1280x1024 and 706x1600 | 92/100 | No-drafts source/output comparisons confirm the Develop action and absent drafts section. |
| Ideas and Library collection rows plus linked drafts, 390x844 | 95/100 | Hover background resolves to the shared semantic muted token over the canvas, not a white row. Both collection routes and the linked-draft case have screenshots and computed-style measurements. |

The capture/mobile viewport is inferred from the supplied raster because the DevTools chrome and CSS viewport metadata are not embedded. That uncertainty is recorded rather than treated as a pixel-perfect comparison. Home’s focused appearance remains unchanged and is covered by the regression check.

## 27 November stabilization follow-up

The [stabilization report](STABILIZATION-REPORT.md) records the latest Home fixes, actual failed/passing runs, live reduced-motion handling and refreshed source comparisons. Its current-status snapshot supersedes earlier claims. The responsive wrapper preserves draft text and usable focus without selection-range snapshots. User visual review and the Ideas populated-mobile source comparison remain open.
