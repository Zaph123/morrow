# Morrow Design System Validation

This report validates the design documentation only. No application code, dependencies, or app theme tokens were changed.

## Checks performed

- Re-read `AGENTS.md`, `docs/morrow-design-planner-preparation.md`, the project brief, PRD, UX/UI specification, old `DESIGN.md`, relevant layout/theme/button implementation, and the planner skill.
- Confirmed the required document sections are present in the prescribed order: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts.
- Confirmed YAML frontmatter delimiters and performed a key-path scan across component token references: **243 references across 70 unique token paths; no unresolved paths or duplicate YAML key paths**.
- Manually reviewed the token groups and representative component recipes for consistent references and theme-specific color pairings.
- Calculated WCAG contrast ratios from the exact sRGB hex values using the WCAG relative-luminance formula. Ratios below are rounded to two decimals.
- Reviewed the prose for unsupported claims, implementation mismatches, overuse of Overtake-specific patterns, and wording that could imply future features are already implemented.

## Contrast measurements

| Use | Foreground | Background | Ratio | Result |
| --- | --- | --- | ---: | --- |
| Light primary text | `#20241F` | `#F7F6F2` | 14.56:1 | Above 4.5:1 |
| Light primary text on surface | `#20241F` | `#FFFFFF` | 15.75:1 | Above 4.5:1 |
| Light supporting text | `#555C53` | `#F7F6F2` | 6.38:1 | Above 4.5:1 |
| Light supporting text on surface | `#555C53` | `#FFFFFF` | 6.90:1 | Above 4.5:1 |
| Dark primary text | `#F1F1EC` | `#111312` | 16.46:1 | Above 4.5:1 |
| Dark primary text on surface | `#F1F1EC` | `#222722` | 13.42:1 | Above 4.5:1 |
| Dark supporting text | `#B1B5AD` | `#111312` | 8.96:1 | Above 4.5:1 |
| Dark supporting text on surface | `#B1B5AD` | `#222722` | 7.30:1 | Above 4.5:1 |
| Light primary action | `#FFFFFF` | `#426B35` | 6.20:1 | Above 4.5:1 |
| Light action hover | `#FFFFFF` | `#35572B` | 8.24:1 | Above 4.5:1 |
| Light focus/action accent on canvas | `#426B35` | `#F7F6F2` | 5.73:1 | Above 4.5:1 |
| Dark primary action | `#111312` | `#A3D977` | 11.33:1 | Above 4.5:1 |
| Dark action hover | `#111312` | `#B5E68D` | 13.03:1 | Above 4.5:1 |
| Dark focus/action accent on raised surface | `#A3D977` | `#222722` | 9.23:1 | Above 4.5:1 |
| Selected light text | `#263125` | `#EAF0E5` | 11.69:1 | Above 4.5:1 |
| Selected dark text | `#EAF0E5` | `#263125` | 11.69:1 | Above 4.5:1 |
| Light control boundary on canvas | `#777E73` | `#F7F6F2` | 3.87:1 | Above 3:1 |
| Light control boundary on white | `#777E73` | `#FFFFFF` | 4.19:1 | Above 3:1 |
| Dark control boundary on surface | `#777E73` | `#222722` | 3.63:1 | Above 3:1 |
| Error text, light | `#A43F35` | `#FFFFFF` | 6.29:1 | Above 4.5:1 |
| Error text on light canvas | `#A43F35` | `#F7F6F2` | 5.81:1 | Above 4.5:1 |
| Error text, dark | `#F2A097` | `#111312` | 9.11:1 | Above 4.5:1 |
| Error text on dark surface | `#F2A097` | `#222722` | 7.42:1 | Above 4.5:1 |
| Warning text, light | `#76530A` | `#FFFFFF` | 6.97:1 | Above 4.5:1 |
| Warning text on light canvas | `#76530A` | `#F7F6F2` | 6.45:1 | Above 4.5:1 |
| Warning text, dark | `#E8BF65` | `#111312` | 10.72:1 | Above 4.5:1 |
| Warning text on dark surface | `#E8BF65` | `#222722` | 8.74:1 | Above 4.5:1 |

The supplied light background and surface have only **1.08:1** contrast (`#F7F6F2` / `#FFFFFF`), so borders and spacing carry meaningful boundaries. The proposed raised dark surface `#222722` is **1.23:1** from the dark canvas `#111312`; it remains a tonal distinction, not a substitute for a needed border. The considered `#1B1E1B` is only **1.04:1** from the dark canvas, so it is assigned an inset role rather than used as the sole raised surface.

The bright green `#A3D977` against white is only **1.65:1**. It is not used as light-theme text or with white button text. Its dark-theme action pairing with `#111312` measures **11.33:1**. This is why the light theme uses the deeper `#426B35` for actions instead.

These are computed color-pair results, not a complete accessibility certification. They do not evaluate font rasterization, translucent overlays, gradients, browser compositing, actual focus-ring thickness/adjacency, or disabled controls. Text must remain paired with explicit labels/icons for status and authorship; color alone is insufficient.

## Validation not run

- The planner's six support references are empty (zero bytes) and its `assets` directory contains no template or example. The skill supplies the high-level Google-format requirement and CLI invocation, but its promised detailed schema and lint rules could not be read.
- `@google/design.md`, `yaml`, and `js-yaml` are not available in `node_modules`, and the package is not declared in `package.json` or `pnpm-lock.yaml`. Python's YAML parser is also unavailable.
- The planner suggests an `npx` command that may download a package. Per task constraints, no dependency was installed and no network command was run. Therefore **the official Design MD linter was not run; lint cleanliness is not claimed**. The frontmatter syntax was manually inspected, but strict YAML/schema parsing remains unverified.
- No additional visual references were provided. The Overtake extraction was used only as a documentation/process reference; its styles were not copied.
- No browser or rendered application was changed or used for visual, responsive, font-fallback, keyboard, reduced-motion, or assistive-technology validation.

## Remaining implementation discrepancies

- `app/layout.tsx` forces `.dark`; although light tokens exist in `app/globals.css`, no System/Light/Dark preference behavior is implemented. The three-way preference is documented as intended future behavior only.
- Inter, Space Grotesk, and Geist Mono remain loaded in `app/layout.tsx`. The recommended editorial serif/Inter/system-monospace roles are design proposals only.
- The current shell is a one-column `max-w-3xl` workspace with a fixed 15rem sidebar and mobile bottom navigation. The optional assistant panel, its collapse/reflow behavior, and a wider Studio canvas are not implemented.
- Existing component radii, spacing, and shadow usage are mixed; this document establishes a proposed semantic hierarchy and does not reconcile code.
- `/studio` remains a manual editor. The assistant panel, AI generation, and expanded planning flows are future intent. Ideas/Content also have the two storage/editor paths recorded in the preparation report.
- Base UI remains the current component foundation. UIArc remains an evaluated candidate; the Arc foundation stylesheet and shared-button replacement were not adopted.
- `ai-generated.json`, `design-tokens.clean.css`, and the five Overtake frame screenshots were treated only as process/pattern references. Their palette, type, marketing canvas, pill CTA geometry, and effects were not copied as Morrow tokens.

## Outcome

The document is internally cross-referenced and its major color combinations have been numerically checked. The key remaining blocker to an official format pass is the unavailable planner schema/linter support combined with the no-install/no-network boundary. Review `DESIGN.md` before any application implementation; the app and its existing design tokens remain unchanged.
