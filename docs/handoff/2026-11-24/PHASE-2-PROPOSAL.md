# Phase 2 proposal: shared light foundation, navigation, and Home

Status: approved by the user on 24 November 2026, including temporary effective-Light behavior and the Add context/Sign out omissions. The initial custom-CDP gate was blocked; the user subsequently approved pinned `@playwright/test` with installed Edge (`msedge`). The synthetic screenshot/interaction gate passed and approved implementation resumed. Current completion and actual verification are recorded in `PHASE-2-REPORT.md`; the original proposal below records the approval scope.

## Outcome and scope

Apply the approved light neutral/lime/DM Sans system to existing semantic tokens, adapt the shared shell/navigation, and convert Home using the selected references. Start with the two accepted helper cleanups, independently reviewable from presentation. Preserve existing work, both stores, existing routes, and all Phase 1 protections. Global tokens and fonts affect other routes; check those for regressions without redesigning their feature screens.

## 1. Accepted helper cleanup

- Add one small non-mutating `sortByUpdatedDesc` helper, likely `lib/sort.ts`. Reuse it in `lib/workspace/repository.ts`, `hooks/use-workspace.ts`, and Home. Preserve the existing descending-date comparator and input order for equal timestamps, including after filtering. Never sort a persisted collection in place or add an ID/title tie-breaker. Home still takes at most three records from each recent collection after sorting.
- Make consumers import `cn` from `@/lib/utils`; change the Button's direct package import. Keep `lib/utils.ts` as the existing package re-export.
- Leave date-formatting output, validation/error contracts, ID generation, persisted domain types, storage keys, and unused files unchanged. No general-purpose data layer, formatter unification, type merger, or cleanup deletion.

## 2. Tokens and reproducible font loading

- Map approved roles into the existing CSS-first Tailwind/shadcn variables: canvas `#F5F5F7`, white surfaces/sidebar, charcoal `#121316`, secondary text `#5E636E`, border `#E5E6EB`, neutral controls `#ECECEF`, lime `#D4FC30` with charcoal text, desktop selection `#F2FCD6`, danger `#BA1A1A`, and focus `#536600`.
- Keep shadcn's neutral hover/accent role distinct from lime primary submission. Use named typography/radius roles: DM Sans throughout, page headings 24/32, settings labels 15/20 medium, mobile fields 16px, and the approved 8/12/16/20px radius responsibilities. Preserve visible keyboard focus. No global Arc foundation import or new motion stack.
- Obtain the unmodified DM Sans variable font from a pinned revision of the official Google Fonts repository, retain its OFL license, source revision, and SHA-256, and load the committed asset through the installed `next/font/local`. Use the upstream file format without adding a conversion package. Replace the current Inter/Geist Mono Google-font build fetches; retain a system monospace fallback for actual mono roles. After the one-time approved asset acquisition, production builds and browser font loads must need no external font service.

## 3. Theme preference recommendation requiring approval

Use an effective Light presentation for this phase because only Light is approved. Preserve the raw existing `morrow.theme` value without clearing or rewriting it. Stored Dark/System preferences remain retained for future support but do not activate the old palette or follow OS dark changes in this build.

Make root initial paint, the bootstrap, and ThemeProvider agree on effective Light. Remove the active Dark/System selector from the shell instead of offering modes that cannot truthfully apply. Put a short static appearance note in the existing Settings/You placeholder explaining that this build uses Light and existing preference is retained. Do not add a replacement theme interaction or permanently remove the preference contract. This policy is part of the approval request, not an already implemented decision.

## 4. Shell and navigation

- Reuse AppSidebar, MobileBottomNav, NavLink, Next Link, and the existing Base UI button/field primitives. Adapt these existing shared components instead of introducing a replacement navigation library.
- Desktop: 240px white sidebar, neutral New idea link to existing Ideas capture, Home / Studio / Library / Ideas / Brand Brain, You at the footer. Calendar remains hidden. Keep existing `/studio`, `/content`, `/ideas`, `/brand-brain`, and `/settings` URLs; Library and You are labels, not route migrations.
- Mobile: five-item charcoal floating capsule; active destination has icon plus label, other icons retain accessible names. Use the exact supplied Brain SVG through one shared icon asset/component. The approved Brain pill on You is a visual exception; do not mark Brand Brain as the current page while on `/settings`.
- Preserve mobile access to You through a plain, named user/account link in the existing top area, with no invented name/photo/initials. `/settings` remains a truthful not-yet-integrated account destination; do not implement Profile/Account forms in this phase.
- Remove the global narrow-width constraint where it prevents route-appropriate layout, while retaining readable editor measures and existing feature compositions. Keep one main landmark, navigation clearance, safe-area padding, visible focus, and 44px mobile targets.
- Hide the floating global nav only when an actual editor is active. The present `/studio` route is already a manual editor, including its blank state; do not invent a new entrance/Discuss flow or hide navigation based only on the presence of text. The `/content/new` and `/content/[id]` editors need the same treatment. Ensure their back links remain reachable.
- Reference exception for approval: omit Sign out until authentication exists. Reserve its future footer responsibility; do not add a dead or simulated auth action. Existing Calendar and development routes remain intact, with no deletion/gating work.

## 5. Home conversion

Use `morrow_desktop_home_cards_centered_refined_radii` and `morrow_mobile_home_cards_v5`, applying the current sidebar and written token/behavior corrections. Use `component_desktop_sidebar_you_active` only for its sidebar anatomy. Original screen ZIPs remain unchanged.

Implement the centered creative heading, capture area, Continue, Revisit an idea, and Blank draft anatomy as responsive React compositions. Keep real recent collections at a maximum of three records each; reference examples do not authorize seeded names, dates, drafts, or publication history. Reuse existing row/button/textarea components as appropriate.

Preserve Home's live legacy storage path, current date-formatting functions, save/reopen/error/retry behavior, keyboard capture shortcut, device-save wording, and successful-write-only input clearing. Keep capture and Blank draft usable while recent work loads or fails. Continue resumes existing Studio writing; Revisit opens the existing idea; Blank draft enters the existing Studio editor without creating a stored record merely by navigation.

Reference exception for approval: omit Home's pre-save Add context control in this phase. Staged note/link capture needs persistence decisions and a reviewed menu/dialog/sheet interaction, and is outside this presentation slice. Do not add an inert control, infer context automatically, or modify persisted types to make the screenshot appear complete.

## Likely files

| Responsibility | Likely files |
| --- | --- |
| Helper cleanup | `lib/sort.ts` (new), `lib/workspace/repository.ts`, `hooks/use-workspace.ts`, `components/home/home-page.tsx`, `components/ui/button.tsx` |
| Font and semantic tokens | `app/layout.tsx`, `app/globals.css`, local assets/license/provenance under `app/fonts/` |
| Theme policy | `lib/theme.ts`, `components/theme/theme-provider.tsx`, `components/theme/theme-select.tsx`, and an appearance note in `app/(workspace)/settings/page.tsx` |
| Shell/navigation | `lib/navigation.ts`, `components/layout/workspace-shell.tsx`, `app-sidebar.tsx`, `mobile-nav.tsx`, `nav-link.tsx`, `nav-icons.tsx`; one supplied Brain icon asset/component |
| Shared primitive presentation | `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, and `select.tsx` only where existing classes prevent approved roles; keep APIs/behavior |
| Home | `components/home/home-page.tsx`; `app/(workspace)/page.tsx` or existing header/list compositions only if needed |
| Verification and reporting | Focused helper/theme/Home tests, a small dependency-free Edge/CDP verification script if necessary, screenshots and QA report, README/current phase notes |

No unrelated feature-screen rebuild is proposed. Any additional necessary source change must remain tied to one of these responsibilities; material expansion returns for review.

## Available browser-verification path

Read-only preflight found Microsoft Edge 158.0.4370.33 at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Node v24.20.0 exposes built-in WebSocket. No browser tool, Playwright, or Puppeteer is available to this session.

Propose using that installed Edge in headless mode with a separate disposable verification profile, a loopback-only DevTools Protocol endpoint, and Node's built-in HTTP/WebSocket support. Capture rendered pages and inspect screenshots with the existing image-viewing tool. This requires no npm package or browser download. Do not touch the user's existing browser profile, close their sessions, expose a public debugging port, or access personal browser data.

The binary and Node capabilities are confirmed; launch, CDP connection, screenshots, and interactions are NOT yet verified. Make that capability check the first executable step after approval, before broad visual conversion. If policy or permissions block it, report the exact blocker and seek a browser/tooling decision; do not silently install dependencies or substitute build/HTTP/controller checks for browser QA.

## Acceptance and verification

1. Sorter returns a fresh array, preserves source arrays and equal-date order, and keeps Home's three-item-per-collection limit. All changed consumers use the same implementation. `cn` consumer imports are consistent.
2. All Phase 1 regression checks still pass. Add focused coverage for sorting, theme preference preservation/first paint, and Home capture/recent-work navigation. No stored IDs, fields, statuses, timestamps, or raw theme preference are rewritten by the conversion.
3. DM Sans renders from pinned local assets; normal build and font rendering make no Google Fonts requests. Build without font-network access after assets are present. Check computed font and actual loading, not only CSS declarations.
4. Light presentation is consistent on fresh load, reload, OS dark preference, existing Light/Dark/System values, and blocked preference storage. Explain the temporary effective-Light policy accurately.
5. Browser screenshots and interactions at 390×844, 320px narrow mobile, 768px tablet, and 1440px desktop; also inspect the 1024px shell transition. Check zoom/text wrapping, no page overflow, active nav labels, route semantics, safe areas, keyboard focus/order, reduced motion, and console/hydration errors.
6. Exercise Home empty/populated/loading/load-failure/save-success/save-failure/retry states with synthetic fixtures only in the isolated verification profile. Verify save/reopen and later edits, and confirm routes still use their original storage paths. Smoke-check Ideas, Studio, both content editors, Brand Brain, and You for regressions from global styles/navigation.
7. Run all regression tests, TypeScript, focused/full lint, production build, and diff review. Compare source references and rendered screenshots at corresponding viewports/states; explicitly record the approved Add context/Sign out omissions. Report what was actually checked and stop at the phase boundary.

## Review boundaries

No new Arc component, overlay, tab widget, replacement shared primitive, capture dialog, profile menu, or context flow is proposed. Existing-component composition and navigation links cover this slice. The one Brain renderer uses the already approved exact asset and adds no interaction. If implementation needs a new shared interaction, inspect actual candidates and return with the required recommendation/alternatives/accessibility/dependency review before adding it.

Storage migration/unification, Supabase/auth integration or live settings, new dependencies, formatting changes, validation changes, ID algorithms, persisted type changes, unused-file deletion, commits, pushes, and deployment are excluded. Preserve unrelated uncommitted work.

Sources checked for the proposal:

- Supplied revision 5 design decisions, flow contracts, selected screen HTMLs, and root `DESIGN.md`.
- Installed version-specific Next.js font documentation under `node_modules/next/dist/docs/`.
- Official DM Sans license: https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt
- Microsoft Edge DevTools Protocol: https://learn.microsoft.com/en-us/microsoft-edge/devtools/protocol/
