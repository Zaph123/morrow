# Phase 1 proposal: align guidance and protect saving

Status: approved by the user on 24 November 2026. Approval explicitly requires preserving `createdAt` and existing record fields, advancing `updatedAt` only on successful mutations, testing failed-save retries and later dirty edits, and stopping at the phase boundary. Prepared from the revision 5 handoff and live repository.

## Already completed under the explicit environment request

- Copied the supplied root `.env.sample` unchanged.
- Added `!/.env.sample` after `.env*` in `.gitignore`.
- Verified the sample is visible to Git and `.env.local` remains ignored and untracked. The existing empty `.env.local` was not changed.
- Extracted the revision 5 document archive beside its source ZIP for inspection. Original archives remain unchanged.

## Live findings

Both persistence systems are active: Home, Ideas, the Content list, and Studio use `lib/storage.ts`; `/content/new` and `/content/[id]` use `ContentEditor` and `lib/workspace/*`. Neither can be removed or substituted without a separate migration plan.

The six existing storage tests pass. Running the supplied review runner also reproduces both draft-creation defects using synthetic data: malformed stored content is overwritten, and server-side creation returns a record without writing it. These characterization checks confirm bugs, not correct behavior.

Idea detail's header Save condition excludes the dirty state, but a second Save button below the editor is reachable. The review's broader implication that all saving is unreachable is therefore inaccurate. Its delayed Saved timer, missing error handling, and misleading deletion message still need fixing. The snapshot's throwing localStorage getter issue is also present in the live workspace helper.

No Supabase SDK or environment consumers are present. No Supabase MCP tools are exposed in this session, and no Supabase CLI command is installed on PATH. The plugin supplies guidance, but live schema, auth/provider settings, and RLS have not been inspected.

## Proposed changes

1. Align project guidance before changing appearance:
   - Replace root `DESIGN.md` with the supplied revision 5 design document, preserving the previous document as explicitly historical material under `docs/handoff/2026-11-24/`.
   - Amend `AGENTS.md` to identify the current light neutral/lime/DM Sans direction and point to the revision 5 collaboration, scope, design, and component policies. Preserve ownership, manual-workflow, data-preservation, and component-review rules.
   - Add a Morrow precedence amendment to `.cursor/rules/arc.mdc` and `.claude/skills/arc/SKILL.md`: shadcn/Base UI remains the baseline; approved Morrow typography/radii/tokens override stock library defaults; foundation import is conditional on an inspected theme bridge; visible focus and reduced motion remain required. Do not edit installed Arc component internals in this phase.
   - Update README status/environment guidance and the older implementation log to distinguish current scope from historical claims. Do not describe Supabase or full workflows as implemented.
2. Protect local writes and truthful state:
   - In `lib/storage.ts`, guard every idea/content writer with checked reads; reject server writes and preserve raw stored values on read/parse/validation/write failure. Preserve IDs, timestamps, unknown record fields, valid historical statuses, platforms, and source relationships when updating existing records.
   - In `lib/workspace/storage.ts`, catch blocked storage property access and report errors rather than letting exceptions escape or displaying a browser failure as empty data.
   - Update affected callers in `components/ideas/idea-detail.tsx`, `components/ideas/ideas-page.tsx`, `components/studio/studio-page.tsx`, `components/content/content-page.tsx`, and, if needed, `components/content/content-editor.tsx` to show read/save/delete failure and retain editable work. Check related hook behavior where error propagation requires it.
   - Remove timer-driven Saved state; derive dirty/saved feedback from the actual persisted editor values. Enable retry after failed saves, including the newer editor's currently disabled error-state save action.
   - Keep drafts when deleting an idea. Preserve their existing source ID as provenance and explain that the source is unavailable, instead of promising the connection was cleared.
3. Extend the existing dependency-free test runner for all writers, malformed/blocked/quota/server failures, preserved relationships/statuses, and successful save/reopen. Add focused state regression coverage where feasible with the installed stack; do not install a UI test framework in this phase without approval.

Existing Button, Textarea, Input, and current inline feedback patterns satisfy this phase. No new Arc component or custom shared interaction is proposed.

## Acceptance and checks

- Failed reads never authorize a replacement write; failed saves retain text and remain retryable.
- Saved feedback corresponds to the current persisted values and never becomes true because a timer elapsed.
- Historical draft/ready/published records and relationships survive edits. Deleting an idea leaves writing intact.
- Browser-blocked storage returns actionable errors for both models. Server execution never reports a successful local mutation.
- No migration, automatic cloud import, browser-key reset, dependency addition, source deletion, remote service change, commit, push, or deployment.
- Run extended storage/state tests, TypeScript, focused and full lint, and production build. Report failures accurately and distinguish prior failures. Attempt browser interaction verification only with an available authorized browser; record a blocker if unavailable. No visual-fidelity claim belongs to this phase.

After this phase, propose shared light tokens, reproducible DM Sans loading, theme behavior, shell/navigation, and Home conversion as the next bounded phase. Supabase integration uses the existing project in a separately approved slice after inspecting its configuration and agreeing the UI-facing persistence contract. Current official Supabase SSR/API-key guidance was consulted during preflight; no service calls or settings changes were made.
