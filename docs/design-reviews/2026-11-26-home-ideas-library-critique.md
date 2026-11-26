---
target: app/(workspace)/page.tsx
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:app/(workspace)/page.tsx"
target_fingerprint: "sha256:8c64d316531cff3ec8850bbbd41639f056434c85f772efb83d2f27674c0017e2"
target_path: "app/(workspace)/page.tsx"
timestamp: 2026-11-26T13-40-27Z
slug: app-workspace-page-tsx
---
Method: dual-agent (A: design_assessment · B: detector_assessment)

# Design critique: Home, Ideas, and Library

Preserved from the generated Impeccable review on 2026-11-26. Only absolute-machine target metadata was normalized. Scores and observations describe that review snapshot; they are not current visual acceptance or a fresh test run.

## Scope and evidence

Reviewed Home (/), Ideas list and detail (/ideas and /ideas/[id]), legacy Library (/content), and shared New idea capture. Primary target: app/(workspace)/page.tsx (slug: app-workspace-page-tsx); additional sources: components/home/home-page.tsx, components/ideas/ideas-page.tsx, components/ideas/idea-detail.tsx, components/content/content-page.tsx.

Evidence includes settled app screenshots and fresh Playwright runs in isolated Edge contexts with synthetic data. Original Stitch sources are under artifacts/references/stitch/; rendered app captures under artifacts/phase-3/ are regression evidence, not design sources. The checks “capture matched Stitch and Morrow collection states” and “server loading states and Home composer focus appearance” passed (2/2). Home composer focus appearance matches its resting appearance.

## Design Health Score

Scores use the Impeccable 0–4 scale. Total: 29/40 — Good; address weaker areas while retaining the solid foundation.

| # | Heuristic | Score | Key evidence |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Local-save status, inline errors, and loading, failure, and success states communicate progress. |
| 2 | Match to real world | 3 | “New idea,” “Develop in Studio,” and local-save language fit a creator’s workflow. |
| 3 | User control and freedom | 3 | Capture can be cancelled, unsaved close is guarded, and deletion has separate confirmation. |
| 4 | Consistency and standards | 3 | Navigation, rows, filters, neutral surfaces, and lime actions share a coherent system. |
| 5 | Error prevention | 3 | Empty saves are disabled and deletion requires confirmation. |
| 6 | Recognition rather than recall | 3 | Search, status metadata, and breadcrumbs help orient users; long detail titles truncate on mobile. |
| 7 | Flexibility and efficiency | 3 | Keyboard shortcuts and multiple capture entry points help; empty Ideas duplicates one action. |
| 8 | Aesthetic and minimalist design | 3 | Quiet surfaces foreground writing; redundant entry points and empty-state ambiguity weaken hierarchy. |
| 9 | Error recovery | 3 | Failed saves preserve text and provide retry; collection load failures provide recovery. |
| 10 | Help and documentation | 2 | Capture guidance exists, but draft counts and development/status distinctions are mostly learned in use. |
| **Total** | | **29/40** | **Good** |

## Design specificity and overall impression

The interface reads as a creator workspace rather than an interchangeable dashboard. Calm light surfaces, direct text capture, and language about developing thoughts over time support Morrow’s ownership and continuity goals. The main opportunity is to make action hierarchy and record identity clearer across routes without increasing density.

Cognitive load is low to moderate: Home makes capture immediate; Ideas and Library group search, filters, and rows predictably; detail keeps editing and save actions near the content. Empty Ideas adds an unnecessary choice by showing both a header plus and a centered New idea button for the same action.

## What’s working

- Home’s “Make something of today” is distinctive and leads directly into “What’s on your mind?”
- Ideas and Library rows are easy to scan, with subtle separators and secondary metadata.
- “It stays on this device until you save it” and “Saved on this device” explain local persistence honestly.
- Capture’s mobile sheet keeps Save and Cancel available and preserves text after failure.

## Priority issues

1. **P2 — Empty Ideas duplicates the New idea action.** The header plus and central button open the same composer, splitting the empty-state focal point without adding capability. Keep one primary action or give the controls distinct hierarchy.
2. **P2 — Mobile Idea detail truncates the record title in its breadcrumb.** A long thought becomes difficult to identify after navigation. Provide a compact but recognizable title treatment while preserving the record text.
3. **P2 — Home’s empty Continue card implies an available draft.** “Continue” conflicts with “No drafts yet. Start whenever you’re ready.” Make the empty card read as an invitation rather than resuming existing work.
4. **P3 — Detail actions feel separated on mobile.** Delete appears in the card footer while the lime Studio action spans a following region. Clarify their importance and relationship at narrow widths.

## Persona red flags

- A first-time creator encounters duplicate capture choices in empty Ideas and may not understand “2 drafts” or “Not developed yet.”
- A mobile user returning to a long idea may not recognize it from the truncated breadcrumb.
- Frequent users may eventually need more list-management support as records accumulate; current small collections remain easy to scan.

## Minor observations

Captured dates and relative dates use different presentations; retain consistency as locale support evolves. “From idea” is useful Library provenance, though platform and status read more prominently.

## Design-taste-frontend lens

This skill is optimized for marketing sites, so its hero, photography, and scroll-moment rules do not fit Morrow’s operate-mode workspace. I applied transferable checks: task clarity, equal content edges, responsive fit, interaction feedback, reduced-motion support, copy clarity, and performance. The screens have consistent mobile gutters, clear task language, and restrained motion. Empty-state action duplication and the ambiguous Continue card are the clearest hierarchy and copy opportunities. The skill’s automated build gate was not run because this repo has no active design-taste build; forcing its landing-site checks would misclassify the app.

## Deterministic detector and browser evidence

The Impeccable CLI detector ran on the four scoped TSX targets and returned [] with exit code 0: zero findings, rules, or locations. No .impeccable/critique/ignore.md exists.

In isolated Edge, injection preflight succeeded and the detector script was injected on Home at 1280×900, Ideas at 390×844, and Library at 1280×900. Home reported one LOW CONTRAST TEXT finding on the disabled Save idea button; Ideas and Library reported none. This is a detector false positive for contrast: WCAG 2.2 SC 1.4.3 exempts text that is part of an inactive UI component such as a disabled button ([W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)). The cited Edge overlay screenshots were captured after 500ms and still showed loading placeholders, so they prove injection and the detector result, not settled-page appearance. Separate settled Playwright renders and the two passing checks above provide visual review evidence.

The Home overlay existed only in the isolated synthetic Edge context; none was injected into the user’s browser. The Impeccable live server was stopped. Cleanup reported config_missing while removing an injected tag because no [Human] overlay path was exposed. The transient script was removed. No product files were changed.

## Questions to consider

Should empty Ideas keep both capture entry points or make one unmistakably primary? On mobile Idea detail, what is the best way to keep a long idea recognizable without repeating its full text?
