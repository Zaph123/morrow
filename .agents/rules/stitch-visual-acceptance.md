# Stitch visual acceptance

## Governing target

Before finalizing a changed Stitch-derived screen, compare its rendered output
with the selected original references and the latest approved written decisions.
Current user corrections and approved scope exceptions override exported details.
Record those exceptions before scoring; do not invent exceptions to excuse drift.

React structure and component internals may differ from generated HTML. Visible
hierarchy, geometry, typography, surfaces and interactive behavior must reflect
the approved target. Reuse suitable approved components and follow the UIArc
source-review policy; do not hand-copy prototype scripts or introduce custom
shared interactions merely to get a visual score.

## Comparable evidence

- Record source files, route, viewport, zoom, scroll position, fixture and state.
- Use matching CSS viewports and equivalent fixture content. Do not compare a
  scaled Stitch thumbnail directly with a full-size browser screenshot.
- Compare empty with empty, populated with populated, and no-drafts detail with
  no-drafts detail. Preserve actual user content; use synthetic fixtures in tests.
- Capture desktop and mobile plus affected breakpoints. Inspect resting, hover,
  keyboard-focus, selected, disabled, loading, error and success states where used.
- Capture open overlays and their relevant state transitions when changed.
- If a preview is incomplete, use its HTML, documented geometry and valid sibling
  references. Do not score a blank/unstyled CDN-blocked source as a valid target.
- Keep original source files distinct from rendered-app evidence. A smoke-test
  screenshot is not a design target or proof of visual acceptance.

## Measured comparison

Inspect computed styles and element bounds alongside screenshots. Record the
reference basis and actual values/deltas for important content widths, alignment,
spacing, type sizes/line heights, icon sizes, borders, radii and state colors.
Choose the governing written value when it supersedes the export; for example,
the current sidebar width must not regress to an older exported width.

Use side-by-side images and, when useful, aligned overlays/diff images. Image
differences are diagnostic: text, raster scaling and antialiasing can affect them.
Do not turn an unexplained pixel-diff result into a claim of design correctness.

## Acceptance score

The user requires at least 90/100 design fidelity. This is an evidence-backed
acceptance rubric, not a claimed pixel-similarity percentage or mathematical
measure of perfection.

| Category | Maximum |
| --- | ---: |
| Layout, structure and hierarchy | 30 |
| Typography, spacing and text wrapping | 25 |
| Colors, surfaces, borders and radii | 20 |
| Hover, focus, selected, disabled and other relevant states | 15 |
| Icons, alignment and control details | 10 |

Score each changed screen at each required viewport, supported by explicit checks
and evidence. Do not average a failing mobile screen into a passing desktop score.
List deductions and residual differences. An unverified required check is not a
pass. If evidence is unavailable, mark visual acceptance blocked rather than
inventing a percentage. Fix observed discrepancies before scoring again.

Even a numerical score of 90 or higher cannot pass with a material structural or
functional mismatch, such as a missing breadcrumb/action group, missing required
working control, incorrect primary interaction, clipped essential content,
unapproved substitute layout, inaccessible operation or data-loss defect.

## Current concrete rules

- Sidebar collapse toggle: inside the New idea header row; transparent at rest;
  reference hover feedback, with a visible keyboard-focus indicator. Keep the
  existing usable hit target and no control protruding over the divider.
- Collection and linked-draft rows: transparent at rest and subtle near-gray on
  hover. The supplied detail reference uses `black / 0.015` over the canvas;
  map this to a shared semantic row-hover role. Do not substitute a white block.
- Idea detail: breadcrumbs left, status and working actions right, aligned to the
  idea-surface width. Preserve truthful device-save and dirty/error feedback.
- When required by the selected detail reference, wire Copy through an existing
  suitable reviewed component and actual clipboard outcomes; never a fake button.
- Hide the drafts section for ideas without drafts; use Develop in Studio there.
  For linked writing, show the correct action and real draft rows. Do not seed
  example relationships merely to match another state of the reference.
- Keep approved functional deferrals explicit. Do not fabricate Add context,
  authentication, cloud state or other unavailable behavior to fill screenshot gaps.
- Home capture retains its approved no-added-focus-frame treatment. This does
  not remove keyboard-focus indicators from unrelated controls or form patterns.

## Completion report

Provide selected source paths, corresponding actual captures, measured differences,
per-screen/per-viewport rubric results, approved exceptions and remaining issues.
Report functional tests separately. A passing build, controller test, browser
interaction test or successful screenshot capture alone does not prove fidelity.

Do not label visual work complete while this gate fails or evidence is missing.
Stop at the approved phase boundary and present the reviewable result; do not
expand implementation into other feature phases to improve an aggregate score.
