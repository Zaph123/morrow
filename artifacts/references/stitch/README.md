# Morrow Stitch reference set

This directory is the stable, repository-local reference set for the two supplied Stitch archives.

- Original ZIPs remain in the external handoff backup rather than being duplicated in Git. [PROVENANCE.md](PROVENANCE.md) records original filenames, SHA-256 hashes and the authorized removal verification. [SOURCE-INTEGRITY.json](SOURCE-INTEGRITY.json) records all 201 extracted-file hashes for checks without local ZIPs.
- `source-a/reference-export/` and `source-b/reference-export/` preserve each archive's original screen names and file layout.
- `SCREEN-CATALOGUE.csv` is the combined catalogue: **94 HTML/PNG pairs plus 11 PNG-only supporting items**. Its `source` column identifies the archive, and all 94 original classifications are retained verbatim. The 11 supporting items are marked `supporting-png-only` because they have no HTML source. The packet-era `SCREEN-MAP.csv` (no `source` column) is preserved only under `docs/handoff/2026-11-24/historical-context/`.
- `SCREEN-INDEX.html` links only to paths inside this directory: 94 HTML links and 105 PNG links, for 199 total index links. The two generated `DESIGN.md` files are retained as archive provenance and are not screen entries.
- Packet-era per-screen HTML SHA-256 / heading inventory: `docs/handoff/2026-11-24/current/screen-manifest.json`. Export review summary: `docs/handoff/2026-11-24/current/REVIEW-SUMMARY.txt`.

These are original design sources. Rendered Morrow screenshots belong under `artifacts/phase-2/` (and future phase evidence directories) and are regression evidence, never replacement design targets.
