# Repository inclusion and hygiene

Audit date: 2026-11-26. Scope: organization and Git inclusion only. **Physical cleanup is now complete as recorded below; the initial-audit sections afterward document the pre-cleanup state.** This report does not complete or verify the interrupted Home rail implementation.

## Authorized physical cleanup follow-up

The user subsequently authorized deletion of verified duplicates, disposable output and idle caches, plus the two local Stitch ZIPs. This section supersedes the initial audit dispositions below. No staging, untracking, commit, push or history changes occurred.

| Deleted | Files | Logical file bytes removed |
| --- | ---: | ---: |
| `.tmp-handoff-compare/` | 33 | 484,080 |
| Generated `.impeccable/` critique tree | 1 | 7,863 |
| `.next/` | 1,444 | 752,025,875 |
| Stitch ZIP A and ZIP B under the former `archives/` directory | 2 | 16,621,963 |
| Disposable browser outputs listed below | 82 | 3,022,723 |
| **Total** | **1,562** | **772,162,504 (736.39 MiB)** |

These are measured file lengths successfully removed, not a claim about physical filesystem allocation or free-space delta. Hard links, compression and concurrent machine activity can affect actual reclaimed disk space. The empty `archives/` directory and empty test-report directories were also removed where present; empty directories have no measured payload.

Before removal, all 33 temporary handoff files hash-matched the external backup. The generated critique matched the complete maintained review after its documented target-metadata normalization and preservation notice. Both ZIPs hash-matched external originals, and all 201 extracted entries matched byte-for-byte. Canonical extraction, catalogue/index and classifications were not edited. Filenames and hashes now live in [Stitch provenance](../artifacts/references/stitch/PROVENANCE.md), with a 201-file [integrity manifest](../artifacts/references/stitch/SOURCE-INTEGRITY.json). No absolute personal backup path was added to shared docs.

An elevated read-only process query identified this repository?s Next.js launcher/server/workers by the exact project path and Next command. Only those processes were stopped (launcher PID 17304, workers 11340 and 7496; server PID 8908 exited with its launcher). No matching project Next process remained before `.next/` deletion. Browser sessions and unrelated Node processes were untouched. The local development server is stopped; starting it again will regenerate `.next/`.

**Retained at that cleanup:** `.trail/cache/` and the repository-local `.pnpm-store/` remain ignored because active Trail/pnpm processes did not identify their repository and ownership could not be established. `node_modules/` and `.env.local` remain untouched. Selected report evidence, comparison sets, source fixtures, test baselines, pending Home/Copy evidence, meaningful diagnostics, portable agent guidance and curated learnings were retained at that time. A later user-authorized screenshot cleanup is recorded below. `artifacts/phase-3/results.json` was additionally retained because maintained report prose refers to it; its precise ignore exception is now explicit. No scripts were found that require repository-local Stitch ZIPs. The canonical README, Phase 3 proposal and historical implementation log now describe external archives and local provenance.

**Post-cleanup verification:** all 201 extracted hashes match; catalogue and index hashes are unchanged; 94 HTML paths, 105 PNG paths and 199 index links resolve; all 94 original classifications match. Final checks resolve 107 local documentation links with no missing targets and pass 95 ignore assertions with no failures. All 206 protected application, test, asset, configuration and local-environment hashes remain unchanged. `git diff --check` passes, the index is unchanged and the staging area is empty. Among 597 existing Git-eligible files, none exceeds 50 MiB; a heuristic scan of 388 eligible text files found no credential-shaped values or private keys. Only `.env.sample` is eligible among environment files. This is not a full historical secret audit.

**Tracked deletions:** none introduced by cleanup. The already-deleted tracked `app/page.tsx` predates both hygiene passes; its replacement workspace route remains present. The 21-path tracked index and existing working changes were preserved.

**Commit/publication considerations:** most project source and documentation remain untracked and need deliberate review/staging in a later authorized commit pass. Copied third-party skills still lack uniform documented redistribution rights and require a provenance/license review before public distribution. Current Home rail implementation/testing remains unfinished; this cleanup does not establish application readiness. The user-global Git ignore permission warning remains; local inclusion checks are authoritative for this pass. Ignored cache retention does not block committing. No remote push or application tests were run.

## Generated screenshot removal (2026-11-27)

At the user's request, 255 generated PNG/JPEG/WebP app captures and comparison composites were removed from `artifacts/phase-2/`, `artifacts/phase-3/`, `artifacts/phase-4/`, and `artifacts/stabilization/` (12,257,064 logical bytes; 11.69 MiB, including 111 tracked files). Original design inputs under `artifacts/references/stitch/` and the Phase 2 source fixtures under `artifacts/phase-2/references/` were preserved. Measurement JSON, test results, source files and written findings remain. Maintained reports no longer link to the deleted generated screenshots. Narrow ignore rules keep future routine raster output in these evidence folders out of Git after the deletions are committed; browser tests can regenerate local captures when needed. Generated app captures are verification output, never design targets.

<details>
<summary>Deleted disposable browser-output paths (82)</summary>

- `artifacts/phase-2/app-run-final.log`
- `artifacts/phase-2/app-run.log`
- `artifacts/phase-2/before-capture-keyboard.png`
- `artifacts/phase-2/before-development.png`
- `artifacts/phase-2/build.log`
- `artifacts/phase-2/correction-results.json`
- `artifacts/phase-2/home-populated-1024.png`
- `artifacts/phase-2/home-populated-320.png`
- `artifacts/phase-2/home-populated-768.png`
- `artifacts/phase-2/lint.log`
- `artifacts/phase-2/preflight-results.json`
- `artifacts/phase-2/route--content-new-1440.png`
- `artifacts/phase-2/route--content-new-390.png`
- `artifacts/phase-2/route--content-workspace-piece-1440.png`
- `artifacts/phase-2/route--content-workspace-piece-390.png`
- `artifacts/phase-2/route--ideas-idea-0-1440.png`
- `artifacts/phase-2/route--ideas-idea-0-390.png`
- `artifacts/phase-2/route--studio-contentId-piece-0-1440.png`
- `artifacts/phase-2/route--studio-contentId-piece-0-390.png`
- `artifacts/phase-2/you-1024.png`
- `artifacts/phase-2/you-1440.png`
- `artifacts/phase-2/you-320.png`
- `artifacts/phase-2/you-390.png`
- `artifacts/phase-2/you-768.png`
- `artifacts/phase-2/test-results/.last-run.json`
- `artifacts/phase-3/browser-run.log`
- `artifacts/phase-3/build.log`
- `artifacts/phase-3/detail-long-320.png`
- `artifacts/phase-3/detail-reference-desktop.png`
- `artifacts/phase-3/detail-reference-mobile.png`
- `artifacts/phase-3/device-toolbar-577-desktop-discard.png`
- `artifacts/phase-3/device-toolbar-672-mobile-capture.png`
- `artifacts/phase-3/device-toolbar-672-mobile-discard.png`
- `artifacts/phase-3/device-toolbar-717-mobile-capture.png`
- `artifacts/phase-3/device-toolbar-717-mobile-discard.png`
- `artifacts/phase-3/editor-regressions.log`
- `artifacts/phase-3/focused-lint.log`
- `artifacts/phase-3/idea-detail-1024.png`
- `artifacts/phase-3/idea-detail-1440.png`
- `artifacts/phase-3/idea-detail-320.png`
- `artifacts/phase-3/idea-detail-768.png`
- `artifacts/phase-3/idea-dirty.png`
- `artifacts/phase-3/idea-load-error.png`
- `artifacts/phase-3/idea-no-drafts-1024.png`
- `artifacts/phase-3/idea-no-drafts-1440.png`
- `artifacts/phase-3/idea-no-drafts-320.png`
- `artifacts/phase-3/idea-no-drafts-768.png`
- `artifacts/phase-3/idea-saved.png`
- `artifacts/phase-3/ideas-empty.png`
- `artifacts/phase-3/ideas-list-1024.png`
- `artifacts/phase-3/ideas-list-1440.png`
- `artifacts/phase-3/ideas-list-320.png`
- `artifacts/phase-3/ideas-list-390.png`
- `artifacts/phase-3/ideas-list-768.png`
- `artifacts/phase-3/ideas-load-error.png`
- `artifacts/phase-3/ideas-loading.png`
- `artifacts/phase-3/ideas-long-320.png`
- `artifacts/phase-3/ideas-no-results-1024.png`
- `artifacts/phase-3/ideas-no-results-1440.png`
- `artifacts/phase-3/ideas-no-results-320.png`
- `artifacts/phase-3/ideas-no-results-390.png`
- `artifacts/phase-3/ideas-no-results-768.png`
- `artifacts/phase-3/ideas-reference-mobile.png`
- `artifacts/phase-3/library-empty.png`
- `artifacts/phase-3/library-list-1024.png`
- `artifacts/phase-3/library-list-1440.png`
- `artifacts/phase-3/library-list-320.png`
- `artifacts/phase-3/library-list-390.png`
- `artifacts/phase-3/library-list-768.png`
- `artifacts/phase-3/library-load-error.png`
- `artifacts/phase-3/library-loading.png`
- `artifacts/phase-3/library-no-results-1024.png`
- `artifacts/phase-3/library-no-results-1440.png`
- `artifacts/phase-3/library-no-results-320.png`
- `artifacts/phase-3/library-no-results-390.png`
- `artifacts/phase-3/library-no-results-768.png`
- `artifacts/phase-3/library-reference-desktop.png`
- `artifacts/phase-3/library-reference-mobile.png`
- `artifacts/phase-3/new-idea-mobile-actions.png`
- `artifacts/phase-3/phase-2-regression.log`
- `artifacts/phase-3/test-results/.last-run.json`
- `test-results/.last-run.json`

</details>

## Initial audit (before authorized physical cleanup)

## Changes

- Root `.gitignore` excludes the local pnpm store, generated Trail graph, temporary handoff comparison tree, generated Impeccable reviews, personal Claude permissions, machine-bound Cursor hook configuration, local Freebuff identity, and routine Playwright output. Existing environment protection and the root `.env.sample` exception remain.
- `artifacts/.gitignore` excludes routine phase output while explicitly retaining selected evidence cited by maintained reports, comparison sets, source fixtures, diagnostic notes/scripts, and pending Home/Copy captures. Original `artifacts/references/stitch/` inputs are outside those exclusions. No snapshot-baseline rule was added.
- The complete Impeccable critique is preserved in [the maintained review](design-reviews/2026-11-26-home-ideas-library-critique.md); only absolute-machine target metadata was normalized. The Phase 3 report now links there. Historical scores are not current acceptance results.
- Root `REVAMP_SUMMARY.md` moved into [historical context](handoff/2026-11-24/historical-context/REVAMP_SUMMARY.md). Its original bytes follow an explicit superseded notice. The historical repository review points to the archive. Current visual authority remains root `DESIGN.md` and the maintained Stitch rules.
- README links to this inclusion policy. No index changes, staging, untracking, commits, pushes, or history changes were made.

## Keep / ignore / archive / inspect

| Decision | Material | Evidence and consequence |
| --- | --- | --- |
| Keep | App source, tests, scripts, runtime assets, fonts/licenses, manifests, pnpm lock/workspace config | Required implementation and verification sources; untouched by this pass. |
| Keep | `DESIGN.md`, `AGENTS.md`, maintained `.agents/rules/`, current handoff guidance, curated `.trail/learnings/` | Durable project authority and decisions. Hidden-directory status is not a reason to exclude them. |
| Keep | `artifacts/references/stitch/` (206 files, 33.55 MiB) | Original design inputs: canonical extraction, two archives, catalogue, index and README. Not generated app screenshots. |
| Keep | `artifacts/phase-2/references/` | Inspected source fixtures used by browser verification, including Home/sidebar source and Brain asset; not disposable app output. |
| Keep | Selected app captures, raw comparison sets and linked diagnostic evidence | Regression/review evidence only. The allowlist preserves report links and pending Home/Copy work. It does not make an app screenshot a design target. |
| Keep | `.mcp.json`, `opencode.json`, `GEMINI.md`, `.codex/config.toml`, `.claude/settings.json`, `.cursor/mcp.json`, `.gemini/settings.json`, `.kiro/settings/mcp.json` | Inspected individually. Public MCP endpoints, package commands, relative Trail setup or guidance; no literal credential values or machine-specific absolute filesystem paths found in these files. No settings were changed. Motion Plus endpoint presence does not establish a license entitlement. |
| Keep / inspect rights | Portable agent rules, skills and reviewer guidance | 81 guidance/config files scanned for credential-shaped values and absolute filesystem paths. No credential-shaped literals found; Cursor hooks are the machine-path exception below. Preserve third-party notices and source. The tree does not establish a uniform redistribution license for all copied skills; review provenance/rights before public distribution. No paid component entitlement was inferred. |
| Ignore | `.claude/settings.local.json`, `.cursor/hooks.json`, `.freebuff/project-id` | Personal permissions/status setup, absolute Windows hook paths, and service-local identity respectively. Files remain on disk; portable rules, hook implementation, skills and other agent settings remain eligible. |
| Ignore | Real `.env*` files; keep root `.env.sample` | Template has two blank public integration values and a localhost origin placeholder; no real credentials. Real values were not printed. |
| Ignore | `.pnpm-store/` (0.01 MiB), `.trail/cache/` (3.80 MiB), existing `.next/` (716.48 MiB), `node_modules/` | Reproducible/store-generated material. Dependency traversal measured 2354.37 MiB but may count pnpm junction/hard-link content repeatedly; sizes are logical file bytes, not reclaimable disk estimates. |
| Ignore / retain locally | `.tmp-handoff-compare/` (33 files, 0.46 MiB) | Extracted comparison snapshot. 25 files match maintained files exactly; all 33 have exact SHA-256 matches in the existing external Downloads handoff backup. No unique content needs promotion from this temporary tree. |
| Ignore / retain findings | `.impeccable/` | Generated critique retained on disk; complete useful findings promoted into maintained docs before exclusion. |
| Ignore | `test-results/`, `playwright-report/`, `blob-report/`, routine phase screenshots/results/logs/traces | Reproducible outputs. Selected evidence has exact exceptions; no blanket `artifacts/` exclusion. |
| Archive | Root `REVAMP_SUMMARY.md` | Superseded warm-neutral/Georgia/Inter and universal animation notes retained in existing historical context; no other completed-phase documents removed. |
| Inspect | `verifications/now-line-clamp.js`, `artifacts/phase-2/inspect-development.cjs`, repeated skill copies | Existing diagnostic implementation or portable guidance, not automatically junk. No deletion or deduplication performed. |

At audit start Git tracked **21 paths**, including an already-deleted `app/page.tsx`; most current application code, tests, docs and references were untracked. Inclusion eligibility is not the same as being tracked. `.gitignore` cannot untrack existing paths. No application deletion shown by the existing working tree was caused by this pass.

The two phase evidence trees contained 199 files / 9.09 MiB before the new ignore file (phase 2: 78 files / 3.98 MiB; phase 3: 121 / 5.11 MiB). Exclusion leaves existing files on disk. No whole agent directory is ignored.

## Stitch integrity and archival candidates

- ZIP A: 101 extracted files; ZIP B: 100. All **201** files match their ZIP entry bytes after accounting for the original top-level handoff directory. **0 mismatches**.
- Catalogue: **94 HTML/PNG pairs + 11 PNG-only supporting items**; all 94 original classifications match the historical screen map. Both generated `DESIGN.md` files remain provenance, not screen entries.
- Coverage: **94 HTML paths, 105 PNG paths, 199 index links**, all present.
- Independent backup check: both ZIP hashes also match the original-named archives in the existing external Downloads handoff backup and its `repo-handoff-backup-2026-11-25/` copy. No backup or reference files were modified.
- ZIP SHA-256: A `cbd31c4d4132c0821c317d46dda8ea8163292744ec5352a7dfd1effdc9764a9f`; B `015f55bd5bfcd3762a88b9524c5f73ce933622389b1a77c6598ea4b37ac6dd86`.

| Candidate requiring a later decision | Reason / consequence |
| --- | --- |
| `artifacts/references/stitch/archives/reference-screens-a.zip` and `reference-screens-b.zip` (15.85 MiB combined) | Payloads match extraction and independently stored backup ZIPs. Archive references remain in the canonical README; deletion/untracking still needs a separate decision and corresponding documentation updates. Keep eligible, untouched. Removing them would discard provenance and break the present archive README description. |
| `.tmp-handoff-compare/` | Fully backed up; eligible for later physical deletion after confirming no process is using it. It is now excluded, not deleted. |
| `.next/`, `.trail/cache/`, `.pnpm-store/`, browser reports | Potential physical cleanup only when idle. Active Node/browser processes exist; Windows process command-line access was denied, so usage ownership could not be safely established. No process was stopped. |
| Tracked files | No untracking proposed automatically. Review the existing 21-path index and unrelated work before any separately authorized staging or removal. |
| Copied third-party skills and unlinked diagnostics | Provenance/redistribution and continued utility warrant review before publishing or deleting. No blanket exclusion. |

**Deleted disposable paths: none.** The superseded root revamp file was archived, preserving its content. No disk-space recovery is claimed.

## Evidence workflow and verification

Keep canonical sources in `artifacts/references/stitch/`. Browser tests still write to their existing paths. Before linking a new generated result in maintained docs, add an exact exception in `artifacts/.gitignore`; do not force-add entire output trees. Keep required fixtures/baselines eligible. Existing selected evidence can be overwritten by future runs, so it records the current local snapshot, not an immutable historical release.

Verification passed for this pass: ZIP/extracted byte comparison (201 files, 0 mismatches); two external ZIP backup hash matches; catalogue coverage, original classification and index-link checks; **101 local Markdown links** with URL decoding (0 missing); **105 Git ignore assertions** for excluded and retained paths (0 failures); **121 protected source/config hashes** (0 changes); and `git diff --check`. The Git staging area remained empty. No app tests/build/browser runs were needed or claimed for documentation/ignore changes. Git emits a pre-existing permission warning reading the user-global ignore file; repository-local ignore behavior was checked without altering that global configuration. A heuristic credential scan is not a complete secret audit or a redistribution license certification.
