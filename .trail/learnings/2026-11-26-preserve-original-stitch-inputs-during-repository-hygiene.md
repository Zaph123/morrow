# Preserve original Stitch inputs during repository hygiene

## Decided

Keep `artifacts/references/stitch/` as original design input because all 201 extracted files match the original ZIP entries, and its catalogue preserves 94 original classifications. `tests/browser/phase-3.spec.ts` produces app comparison evidence, which must never replace those sources. `.gitignore` and `artifacts/.gitignore` exclude routine output while retaining selected report evidence. See `docs/REPOSITORY-HYGIENE.md` for the audit and checks.

## Tried and ruled out

Blanket artifact or agent-directory ignores would hide authoritative sources and portable guidance. Ignore rules do not untrack existing files or recover disk space. Hidden status and size alone do not establish disposability.

## Watch out

Most project sources were untracked during the audit. Stitch ZIPs match extraction and external backups, but archive removal still requires a separate decision and reference updates. Caches remain because active browser/Node processes could not be attributed safely. Durable Impeccable findings are in `docs/design-reviews/`; `REVAMP_SUMMARY.md` is archived under historical context.

## Authorized physical cleanup follow-up

The user subsequently approved deletion. Both ZIPs were removed after external-backup and 201-entry extraction verification; archive filenames/hashes remain in `artifacts/references/stitch/PROVENANCE.md`, and `SOURCE-INTEGRITY.json` records extracted hashes. Temporary comparisons, generated critiques, disposable output and the verified-idle `.next/` tree were deleted. Only project-owned Next processes were stopped. Trail cache and local pnpm store remain ignored because active-process ownership was uncertain. See the updated hygiene report; the earlier deletion-review boundary has been satisfied for these paths.
