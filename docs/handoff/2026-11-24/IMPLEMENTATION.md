# Handoff implementation

Started 24 November 2026. The user authorized starting the handoff in the existing repository.

**Historical start log:** the source paths and sequence below describe the earlier pass. Revision 5 is the current packet; maintained copies live under `docs/handoff/2026-11-24/current/`. Verified extracted Stitch sources and the combined catalogue live under `artifacts/references/stitch/`; original ZIPs are retained externally with in-repository provenance. A complete off-repo backup of the original zip packet is kept outside this repository. The user approved the bounded Phase 1 proposal; later phases still need approval. The earlier root design document is preserved as `HISTORICAL-root-DESIGN.md`; root `DESIGN.md` now contains the approved light neutral/lime/DM Sans guidance.

**Review correction:** before Phase 1, Idea detail's header Save action excluded the dirty state, but the lower Save button remained available. Saving was not wholly unreachable. The timer could still incorrectly mark later edits saved. Both `/content/new` and `/content/[id]` actively use the second storage model; those components are not unused cleanup targets.

## Sources and precedence

Authoritative in-repo locations: `docs/handoff/2026-11-24/current/` (contracts),
`docs/handoff/2026-11-24/historical-context/` (packet provenance), root `DESIGN.md`,
`.agents/rules/stitch-to-morrow.md`, and `artifacts/references/stitch/` (archive provenance,
extracted sources, `SCREEN-CATALOGUE.csv`, `SCREEN-INDEX.html`).
Original zip names: `morrow-handoff-documents-r5-…`, `morrow-reference-screens-a-…`,
`morrow-reference-screens-b-…` (external archive filenames and hashes are recorded in
`artifacts/references/stitch/PROVENANCE.md`; repository-local duplicates were
removed after backup and extraction verification on 2026-11-26).

Follow repository instructions and direct user decisions first. For visual conversion, the new light neutral/lime/DM Sans decisions supersede the older proposed visual palette. Do not import Arc foundation CSS over Morrow tokens. New shared interactions still follow the repository's component review requirement.

## Repository findings

- Next.js 16.4.2 App Router, React 19.3, Tailwind 4, pnpm, Base UI buttons, Lucide, and Motion are installed.
- The working tree had substantial existing uncommitted work when implementation began. Preserve it.
- Live Home, Ideas, Content, and Studio components use `lib/storage.ts`, `types/index.ts`, and keys `morrow:ideas` / `morrow:content`.
- Other editor components use `lib/workspace/*`, `hooks/use-workspace.ts`, and a separate versioned snapshot. These are not the storage model used by all live routes. Switching routes to them without reconciliation would hide existing data.
- No Supabase client or AI provider dependency is installed. Provider setup is not verified.

## First implementation pass

- Home composes existing Button, Textarea, and list components to capture an idea without navigating away. It uses the live repository model, clears only after a successful synchronous device write, confirms device persistence, and links to the saved idea.
- Save failures retain the capture and give recovery guidance. Recent-work load failures have a retry state and do not masquerade as an empty account. Capture remains available during recent-work loading.
- Idea creation validates the existing collection before writing, so corrupt or unrecognized stored data cannot be replaced by an empty fallback array. Read helpers retain existing ready/published statuses.
- Calendar is removed from live navigation; the existing route and archived designs are preserved.
- This pass does not claim screenshot fidelity or implementation of the entire designed core.

## Remaining implementation sequence

1. Reconcile both storage models deliberately. Preserve raw legacy data, IDs, source relationships, statuses, and independent writing. Specify duplicate/conflict handling and recovery before a migration. Do not silently rewrite data on render.
2. Convert the shared shell and Home using selected desktop/mobile references. Adopt central DM Sans/light neutral/lime tokens and the exact supplied Brain asset. Reuse approved primitives; review any new shared interactions before introducing them. Verify in a real browser at 390Ã—844, narrower mobile, tablet, and desktop.
3. Convert Ideas/detail and staged note/link context, then Library and Studio. Preserve source ideas; add independent platform versions, revision-aware saving, explicit context selection, and accept/undo.
4. Implement Brand Brain manual forms, pending examples, and explicit learning approval.
5. Implement You and Supabase email/password + Google using actual configuration, ownership policies, and safe callbacks. Inspect operational settings before service changes. No fake sign-out or identity state.
6. Resolve the AI provider before provider-specific calls; keep manual workflows available with truthful unconfigured states.

Calendar and publication recording follow later. No deployment is authorized by this handoff start.

## Verification

Run `node --test scripts/test-local-storage.mjs`, `pnpm.cmd exec tsc --noEmit`, `pnpm.cmd lint`, and `pnpm.cmd build`. The storage tests cover capture/reopen, corrupt-data protection, blocked storage, quota failure, historical statuses, and server/empty-input failures. Record actual results in the work report. Browser fidelity and interaction QA remain required for the visual conversion.

Results from this pass: all six storage tests passed; TypeScript passed. Focused ESLint passed for Home, the checked storage helpers, navigation, and the test runner. Full-repository lint failed while scanning the pre-existing `design-exploration` directory (`ENOENT`); it is not a passing check. The build failed because the existing `next/font` imports could not fetch Inter and Geist Mono from Google Fonts. No browser verification was performed. The Ideas capture also now displays failures from the checked create helper and retains entered text.

