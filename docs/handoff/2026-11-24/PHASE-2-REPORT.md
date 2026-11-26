# Phase 2 report: complete within the approved scope

25 November 2026. The synthetic Edge screenshot/interaction gate passed before visual implementation resumed. Final visual and functional acceptance checks have now passed. Earlier partial/blocked status is superseded by this report. No Phase 3 implementation has started.

## Delivered

- Shared non-mutating `sortByUpdatedDesc`, stable equal-date ordering, Home's three-record limit per collection, and consistent `cn` imports through `lib/utils`.
- Official, unmodified local DM Sans variable upright and italic assets, pinned to Google Fonts revision `5b35b7208dd4100571326fdf37f030b32a524232`, with OFL, metadata and SHA-256 provenance in `app/fonts/`. `next/font/local` replaces the root Google-font imports; monospace roles use system fonts.
- Approved light neutral/lime semantic tokens, flat fields, role-based radii, readable mobile field text and visible keyboard focus. No Arc foundation import or replacement shared interaction.
- Effective Light at server render, bootstrap and provider application. The raw `morrow.theme` value is not rewritten on mount, reload or OS-theme changes. Browser checks covered absent, Light, Dark, System, unknown and blocked preferences. The user-facing note is simply **Appearance: Light.** The preference API and unused selector file remain available for a future approved appearance phase.
- White 240px desktop sidebar, neutral New idea link, Home/Studio/Library/Ideas/Brand Brain, and You footer. Mobile uses five named destinations in the dark capsule, the exact supplied Brain SVG, and a named You link. The visual Brain selection on You does not falsely declare Brand Brain the current page.
- Existing URLs retained. The floating mobile nav is hidden for Studio and both content editors. Existing back links remain reachable. The shell allows route-specific widths; existing editors retain a 48rem reading width.
- Responsive Home capture, Continue, Revisit an idea and Blank draft. Recent links use real browser data only; synthetic examples exist only in tests. Capture retains its keyboard shortcut, write-failure text, successful-write-only clearing, device-save feedback and View idea link. Blank draft navigation creates no record. Capture and Blank draft remain available during recent-work loading and errors.

## Data and scope protection

Both active storage formats and their original callers remain separate: Home/Ideas/Library/Studio use `morrow:ideas` and `morrow:content`; the newer content editors use `morrow.workspace.v1`. No migration, ID rewrite, persisted-type change or store merger occurred. Phase 1 creation-time, unknown-field, status/provenance, successful-mutation timestamp and retry protections remain covered. Later edits remain unsaved after an earlier successful save.

No backend/live Supabase changes, additional browser downloads, new UI packages, commits, pushes or deployment were performed. The only requested new development dependency is exact `@playwright/test@1.65.1`. Original reference ZIPs, previous work and unused source files were preserved. The separately requested earlier formatter consolidation remains unchanged.

Dependency baseline note: the repository was initially observed with Next.js/eslint-config-next 16.4.2 and later contained 16.4.6 plus `experimental.agentUpgrade: "security"`. No manual framework-upgrade command was issued in this continuation. The source of that automatic/concurrent change is not established; those edits were left intact rather than reverting potentially unrelated work. Final checks ran against the installed 16.4.6 tree. This is distinct from the explicitly approved Playwright addition.

## Browser diagnosis and evidence

The earlier inline custom probe had ID-keyed pending commands and resolved `m.result` directly, so successful `{}` responses were not inherently rejected by a truthiness check. Its page-target socket required no flattened session ID for page commands. Its weaknesses were unguarded JSON parsing, limited socket/process diagnostics, no pending-command rejection on socket close, and a five-second `Page.enable` deadline. Earlier cross-call launch/discovery failures and that timeout did not establish an Edge incompatibility or a root cause. No reusable probe file was present. The custom harness was not extended further.

The approved established-tool replacement uses installed Edge **158.0.4370.33**, Playwright's `msedge` channel, temporary browser profiles and isolated per-test contexts. It does not attach to personal sessions. Browser/page commands, screenshot and interaction run within Playwright's managed browser lifetime. Playwright uses its managed CDP pipe; this replaces the raw WebSocket path without claiming to establish the earlier timeout's cause.

The independent preflight returned `Browser.getVersion`, `Runtime.evaluate` with value **2**, `Page.getFrameTree`, and successful empty `Page.enable` response **{}**. Typing into a synthetic field and pressing Enter on a focused button produced **Verified: Synthetic test**, then a screenshot was captured. No page errors or crashes were recorded. The raw `pw:protocol,pw:browser` log includes command IDs, session routing, responses, process stderr and orderly browser exit code 0; the summarized response JSON contains no errors.

- [Preflight screenshot](../../../artifacts/phase-2/browser-preflight.png)
- [Raw protocol/process log](../../../artifacts/phase-2/preflight-protocol.log)
- [Independent command results](../../../artifacts/phase-2/preflight-cdp-responses.json)

Tests retain a 45-second per-test and 10-second assertion budget; app startup is bounded at 90 seconds. An earlier combined editor scenario exceeded its test budget and was split into independent route and editor cases. Initial failed assertions were corrected to distinguish the footer You link and Next's route announcer, and clearance is verified after actual scrolling. An earlier sandboxed runner left its own test server during shutdown; only its recorded PID/start-time-matched server and launcher were stopped. The final authorized run exited normally with all checks passing. No personal browser processes were stopped.

## Actual verification results

| Check | Result |
| --- | --- |
| Existing regression suite plus sorter/theme coverage | **34 passed, 0 failed** (`node --test scripts/test-*.mjs`) |
| Independent Edge synthetic preflight | **1 passed**; screenshot plus keyboard interaction |
| Final production-app Edge suite | **22 passed, 0 failed, 0 skipped, 0 flaky**, exit 0, 3.2 minutes |
| TypeScript | `pnpm.cmd exec tsc --noEmit` passed; final build's TypeScript also passed |
| Full ESLint | `pnpm.cmd lint` passed, exit 0 |
| Final production build | `pnpm.cmd build` passed, exit 0; all 14 pages generated |
| Whitespace/diff check | `git diff --check` passed |

The final browser suite checked 320, 390, 768, 1024 and 1440px widths; no horizontal overflow; desktop/mobile links and current-page semantics; You's Brain exception; actual locally loaded font faces and same-origin font requests with Google font endpoints blocked; Light across reloads and OS changes; blocked preference storage; empty/populated/loading/load-error/save-error/saved Home states; keyboard focus, Tab/Enter and Ctrl+Enter; save/reopen; failed-write retry; metadata preservation; later unsaved edits; and both editor persistence paths. Ideas/detail, Studio, Library, new/existing workspace content, Brand Brain and You were smoke-checked for shared-style/navigation regressions. Reduced-motion preference and a 720x450 CSS viewport representing 200% desktop reflow were exercised. No application console/hydration errors were recorded in the final run.

Machine-readable results: [app-results.json](../../../artifacts/phase-2/app-results.json). Logs: [final browser run](../../../artifacts/phase-2/app-verified.log), [regressions](../../../artifacts/phase-2/regressions.log), [build](../../../artifacts/phase-2/build-final.log), [lint](../../../artifacts/phase-2/lint-final.log), [typecheck](../../../artifacts/phase-2/typecheck.log). PowerShell renders native stderr notices as `NativeCommandError` text in redirected logs; the reported exit codes above are the actual process results. The NO_COLOR/FORCE_COLOR notice is runner output, not an application error.

## Reference comparison

Inspected the supplied desktop/mobile PNGs and corresponding HTML, then compared rendered screens at the corresponding CSS viewports: **1280x1024 desktop** and **390x884 mobile**. Original PNG exports are scaled raster captures; this is a layout/state comparison, not a claimed zero-pixel-difference result.

- [Desktop, one synthetic draft/idea and enabled Save](../../../artifacts/phase-2/desktop-reference.png)
- [Mobile, same state](../../../artifacts/phase-2/mobile-reference.png)
- [Mobile after scrolling: final cards clear the capsule](../../../artifacts/phase-2/mobile-bottom-clearance.png)
- [Five-width populated example](../../../artifacts/phase-2/home-populated-390.png), [desktop example](../../../artifacts/phase-2/home-populated-1440.png)
- [Empty](../../../artifacts/phase-2/home-empty-390.png), [loading](../../../artifacts/phase-2/home-loading.png), [load error](../../../artifacts/phase-2/home-load-error.png), [save failure](../../../artifacts/phase-2/home-save-error.png), [saved](../../../artifacts/phase-2/home-saved.png)

The desktop centered column, three-card anatomy, mobile heading break, wide Continue card and two smaller cards, light/lime roles, radii, typography and navigation were compared. Intentional differences follow the approved written corrections: 240px white sidebar; real date/records; named generic You access instead of invented identity; no Calendar nav, collapse control, Add context or Sign out; keyboard shortcut help; error/retry states; visible keyboard focus; disabled Save for empty input; and additional recent rows up to the preserved limit of three. Content can scroll instead of being clipped to the reference's fixed mobile frame.

## Changed files

| Area | Files |
| --- | --- |
| Helpers | `lib/sort.ts`, `lib/workspace/repository.ts`, `hooks/use-workspace.ts`, `components/ui/button.tsx` |
| Font/tokens/theme | `app/layout.tsx`, `app/globals.css`, `lib/theme.ts`, `app/fonts/DMSans-variable.ttf`, `app/fonts/DMSans-Italic-variable.ttf`, `app/fonts/OFL.txt`, `app/fonts/METADATA.pb`, `app/fonts/SOURCE.md` |
| Shell/nav | `lib/navigation.ts`, `components/layout/workspace-shell.tsx`, `app-sidebar.tsx`, `mobile-nav.tsx`, `nav-link.tsx`, `nav-icons.tsx`, new `brain-icon.tsx`, `page-header.tsx` |
| Home/fields/widths | `components/home/home-page.tsx`, `components/ui/input.tsx`, `app/(workspace)/settings/page.tsx`; reading-width-only changes in `components/ideas/idea-detail.tsx`, `components/studio/studio-page.tsx`, `components/content/content-editor.tsx` |
| Verification | `package.json`, `pnpm-lock.yaml` (approved Playwright addition; separate baseline note above), `playwright.config.ts`, `tests/browser/preflight.spec.ts`, `tests/browser/phase-2.spec.ts`, `scripts/test-sort.mjs`, `scripts/test-theme.mjs`, fixture event support in `scripts/helpers/local-runtime.mjs`, evidence under `artifacts/phase-2/` |
| Guidance/report | `README.md`, the runtime-status sentence in `AGENTS.md`, `docs/handoff/2026-11-24/PHASE-2-PROPOSAL.md`, this report |

The working tree contains other pre-existing changes. This table identifies Phase 2 work rather than treating the entire git diff as newly authored.

## Remaining limitations and next boundary

There is no remaining browser blocker for this approved slice. Browser verification covers installed Edge only; it does not claim Safari/Firefox, actual browser-menu zoom, a screen-reader audit or pixel-identical screenshot testing. Other feature screens retain their existing compositions. Both stores remain separate, so records in one are not automatically listed by the other. Authentication, cloud sync, AI generation, Calendar and Brand Brain functionality are still unimplemented.

Deferred controls are recorded for their functional phases:

- **Add context:** restore in the staged note/link capture slice, after persistence decisions and menu/dialog/sheet review; preserve pending text and creator control.
- **Sign out:** restore sidebar/mobile account actions in the real authentication/You slice, with session handling and unsaved-work protection.
- **Appearance choices:** retain existing preferences until a separately approved theme presentation supports them.

Recommend a bounded **Phase 3 proposal for Ideas capture/detail and the legacy Library list presentation**, reusing approved primitives and the established Edge suite. Include real empty/error/loading/dirty/saved states, long-content/mobile checks and existing edit/reopen routes. Keep Studio/newer editor redesign, new shared interactions, store unification/migration, auth/backend work and deployment out of that slice unless separately approved. Do not begin Phase 3 from this recommendation.

## Focused visual correction, 25 November 2026

The approved correction removes Home's inner textarea rectangle and moves its focus treatment to the capture card. This is scoped by `.home-capture`: resting, pointer-focused and keyboard-focused textarea styles have **0px border**, no outline and no box-shadow. The resting card has its neutral 1px border; pointer focus changes that border to the focus color, and when the textarea matches `:focus-visible`, the card also gets a 2px focus outline with a 2px offset. Edge regards the text field as `:focus-visible` on pointer focus too, so both pointer and keyboard focus showed the card outline in this run. An Ideas field was separately checked and retains its own visible focus ring. Capture, Ctrl+Enter, success feedback and existing failure handling were not changed.

The 240px desktop sidebar now uses the reference's 24px side padding, full-width 44px New idea action with 18px plus, 32px gap before navigation, 20px icons, 12px icon/label gap and 15px labels. The desktop Library icon uses the reference geometry while mobile retains its existing icon; the exact supplied Brain SVG is unchanged. The actual route controls the pale selected row and `aria-current`; You remains at the bottom. The extra tagline was removed. Calendar, Sign out and Add context remain deferred.

Playwright Edge screenshots at reference CSS viewports: [desktop rest](../../../artifacts/phase-2/correction-home-rest.png), [desktop pointer focus](../../../artifacts/phase-2/correction-home-pointer.png), [desktop keyboard focus](../../../artifacts/phase-2/correction-home-keyboard.png), [desktop You selected](../../../artifacts/phase-2/correction-sidebar-you.png), [mobile rest](../../../artifacts/phase-2/correction-mobile-rest.png), [mobile keyboard focus](../../../artifacts/phase-2/correction-mobile-keyboard.png). The [computed state values](../../../artifacts/phase-2/correction-focus-styles.json) record border, outline and shadow. Screenshots were compared with `component_desktop_sidebar_you_active` and the approved Home references, rather than pixel-diffed. The You reference includes Calendar and Sign out and reserves their vertical space; those approved omissions mean You sits lower in Morrow. The rest of the page is the real You placeholder rather than the reference's blank canvas; Home uses real empty states and shortcut help rather than seeded reference copy. The active desktop row follows the actual route rather than showing You on Home.

The existing development log records a React hydration mismatch because the browser-side `<body>` had an extra `cz-shortcut-listen="true"` attribute absent from server HTML and Morrow source. That evidence is consistent with a browser extension or other client-side injection; the responsible extension was not independently identified. An isolated Edge context did not reproduce that body hydration warning in the correction tests. The development indicator was not disabled and the user's browser/session was not modified. Separately, the isolated connection to the already-running development server logged an HMR WebSocket handshake failure in this sandbox, so it does not establish HMR health in the user's browser.

Verification: all **34 Node regression tests passed**, including both storage formats and failed-save retry protections; final production build and its TypeScript check passed; focused ESLint passed; the final correction suite passed **2/2** in isolated Edge, including desktop and mobile screenshot states, route selection, other-field focus and synthetic keyboard save. The original pre-correction browser-results JSON was overwritten by the first correction run because it shared a reporter path; the runner now writes correction results to a separate file. The prior 22-test run remains documented in the retained `app-verified.log`. The full existing Phase 2 browser suite was rerun against the corrected build: **22 passed**, restoring its separate results artifact.
