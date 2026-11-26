---
name: "Morrow"
description: "Quiet Vitality: a writing-first creative workspace with warm, restrained character."

colors:
  light:
    canvas: "#F7F6F2"
    surface: "#FFFFFF"
    surface-inset: "#EFEDE5"
    text: "#20241F"
    text-muted: "#555C53"
    border: "#D8D9D0"
    border-control: "#777E73"
    action: "#426B35"
    action-hover: "#35572B"
    action-foreground: "#FFFFFF"
    action-soft: "#EAF0E5"
    action-soft-foreground: "#263125"
    focus: "#426B35"
    success: "#426B35"
    warning: "#76530A"
    danger: "#A43F35"
  dark:
    canvas: "#111312"
    surface: "#222722"
    surface-inset: "#1B1E1B"
    text: "#F1F1EC"
    text-muted: "#B1B5AD"
    border: "#393E38"
    border-control: "#777E73"
    action: "#A3D977"
    action-hover: "#B5E68D"
    action-foreground: "#111312"
    action-soft: "#263125"
    action-soft-foreground: "#EAF0E5"
    focus: "#A3D977"
    success: "#A3D977"
    warning: "#E8BF65"
    danger: "#F2A097"

typography:
  display:
    fontFamily: '"Georgia", "Times New Roman", serif'
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  heading-1:
    fontFamily: '"Georgia", "Times New Roman", serif'
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  heading-2:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  heading-3:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-small:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  editor:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.02em"
  control:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: "normal"
  technical:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"

spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
  9: "64px"
  10: "80px"

rounded:
  control: "8px"
  row: "10px"
  panel: "12px"
  dialog: "16px"
  sheet: "20px"
  pill: "9999px"

shadows:
  floating-light: "0 12px 32px rgba(32, 36, 31, 0.12)"
  floating-dark: "0 16px 40px rgba(6, 9, 6, 0.38)"

layout:
  sidebar-width: "15rem"
  content-reading-measure: "68ch"
  assistant-panel-target: "22rem"
  page-gutter-compact: "16px"
  page-gutter-wide: "32px"

motion:
  quick: "120ms"
  standard: "180ms"
  panel: "240ms"
  easing-standard: "cubic-bezier(0.2, 0, 0, 1)"
  easing-exit: "cubic-bezier(0.4, 0, 1, 1)"

components:
  button-primary:
    backgroundColor: "{colors.light.action}"
    textColor: "{colors.light.action-foreground}"
    borderColor: "{colors.light.action}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    height: "{spacing.7}"
  button-primary-hover:
    backgroundColor: "{colors.light.action-hover}"
    textColor: "{colors.light.action-foreground}"
  button-primary-dark:
    backgroundColor: "{colors.dark.action}"
    textColor: "{colors.dark.action-foreground}"
    borderColor: "{colors.dark.action}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    height: "{spacing.7}"
  button-primary-hover-dark:
    backgroundColor: "{colors.dark.action-hover}"
    textColor: "{colors.dark.action-foreground}"
  button-secondary:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border-control}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    height: "{spacing.7}"
  button-secondary-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border-control}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    height: "{spacing.7}"
  input:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border-control}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    focusColor: "{colors.light.focus}"
  input-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border-control}"
    rounded: "{rounded.control}"
    typography: "{typography.control}"
    padding: "{spacing.3} {spacing.4}"
    focusColor: "{colors.dark.focus}"
  input-error:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.danger}"
    errorTextColor: "{colors.light.danger}"
  input-error-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.danger}"
    errorTextColor: "{colors.dark.danger}"
  writing-surface:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    typography: "{typography.editor}"
    rounded: "{rounded.panel}"
    padding: "{spacing.5} {spacing.6}"
    maxWidth: "{layout.content-reading-measure}"
  writing-surface-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border}"
    typography: "{typography.editor}"
    rounded: "{rounded.panel}"
    padding: "{spacing.5} {spacing.6}"
    maxWidth: "{layout.content-reading-measure}"
  content-row:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    typography: "{typography.body}"
    rounded: "{rounded.row}"
    padding: "{spacing.3} {spacing.4}"
    iconGap: "{spacing.1}"
    transitionDuration: "{motion.quick}"
    transitionEasing: "{motion.easing-standard}"
  content-row-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border}"
    typography: "{typography.body}"
    rounded: "{rounded.row}"
    padding: "{spacing.3} {spacing.4}"
  card:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    rounded: "{rounded.panel}"
    padding: "{spacing.5}"
  card-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border}"
    rounded: "{rounded.panel}"
    padding: "{spacing.5}"
  chip-selected:
    backgroundColor: "{colors.light.action-soft}"
    textColor: "{colors.light.action-soft-foreground}"
    rounded: "{rounded.control}"
    padding: "{spacing.2} {spacing.3}"
  chip-selected-dark:
    backgroundColor: "{colors.dark.action-soft}"
    textColor: "{colors.dark.action-soft-foreground}"
    rounded: "{rounded.control}"
    padding: "{spacing.2} {spacing.3}"
  status-error:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.danger}"
  status-error-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.danger}"
  status-warning:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.warning}"
  status-warning-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.warning}"
  status-success:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.success}"
  status-success-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.success}"
  tooltip:
    backgroundColor: "{colors.light.text}"
    textColor: "{colors.light.surface}"
    rounded: "{rounded.control}"
    typography: "{typography.label}"
    padding: "{spacing.2} {spacing.3}"
  tooltip-dark:
    backgroundColor: "{colors.dark.surface-inset}"
    textColor: "{colors.dark.text}"
    rounded: "{rounded.control}"
    typography: "{typography.label}"
    padding: "{spacing.2} {spacing.3}"
  dialog:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    rounded: "{rounded.dialog}"
    padding: "{spacing.5} {spacing.6}"
    shadow: "{shadows.floating-light}"
  dialog-dark:
    backgroundColor: "{colors.dark.surface}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border}"
    rounded: "{rounded.dialog}"
    padding: "{spacing.5} {spacing.6}"
    shadow: "{shadows.floating-dark}"
  workspace-shell:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text}"
    pageGutter: "{layout.page-gutter-compact}"
    pageGutterWide: "{layout.page-gutter-wide}"
    sidebarWidth: "{layout.sidebar-width}"
  workspace-shell-dark:
    backgroundColor: "{colors.dark.canvas}"
    textColor: "{colors.dark.text}"
    pageGutter: "{layout.page-gutter-compact}"
    pageGutterWide: "{layout.page-gutter-wide}"
    sidebarWidth: "{layout.sidebar-width}"
  assistant-panel:
    backgroundColor: "{colors.light.surface-inset}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    rounded: "{rounded.panel}"
    width: "{layout.assistant-panel-target}"
    padding: "{spacing.5}"
    transitionDuration: "{motion.panel}"
    transitionEasing: "{motion.easing-standard}"
  assistant-panel-dark:
    backgroundColor: "{colors.dark.surface-inset}"
    textColor: "{colors.dark.text}"
    borderColor: "{colors.dark.border}"
    rounded: "{rounded.panel}"
    width: "{layout.assistant-panel-target}"
    padding: "{spacing.5}"
    transitionDuration: "{motion.panel}"
    transitionEasing: "{motion.easing-standard}"
  assistant-sheet:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    borderColor: "{colors.light.border}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.5}"
    shadow: "{shadows.floating-light}"
    transitionDuration: "{motion.standard}"
    transitionEasing: "{motion.easing-exit}"
  home-title:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text}"
    typography: "{typography.display}"
  page-title:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text}"
    typography: "{typography.heading-1}"
  section-title:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text}"
    typography: "{typography.heading-2}"
  row-title:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text}"
    typography: "{typography.heading-3}"
  supporting-copy:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text-muted}"
    typography: "{typography.body-small}"
  technical-meta:
    backgroundColor: "{colors.light.surface}"
    textColor: "{colors.light.text-muted}"
    typography: "{typography.technical}"
  page-shell:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text}"
    pageGutter: "{layout.page-gutter-compact}"
    pageGutterWide: "{layout.page-gutter-wide}"
    sidebarWidth: "{layout.sidebar-width}"
    sectionGap: "{spacing.8}"
    majorSectionGap: "{spacing.9}"
    pageVerticalRhythm: "{spacing.10}"
  page-shell-dark:
    backgroundColor: "{colors.dark.canvas}"
    textColor: "{colors.dark.text}"
    pageGutter: "{layout.page-gutter-compact}"
    pageGutterWide: "{layout.page-gutter-wide}"
    sidebarWidth: "{layout.sidebar-width}"
    sectionGap: "{spacing.8}"
    majorSectionGap: "{spacing.9}"
    pageVerticalRhythm: "{spacing.10}"
  status-chip:
    backgroundColor: "{colors.light.action-soft}"
    textColor: "{colors.light.action-soft-foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.1} {spacing.2}"
  status-chip-dark:
    backgroundColor: "{colors.dark.action-soft}"
    textColor: "{colors.dark.action-soft-foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.1} {spacing.2}"
  nav-item:
    backgroundColor: "{colors.light.canvas}"
    textColor: "{colors.light.text-muted}"
    rounded: "{rounded.control}"
    padding: "{spacing.3} {spacing.4}"
  nav-item-dark:
    backgroundColor: "{colors.dark.canvas}"
    textColor: "{colors.dark.text-muted}"
    rounded: "{rounded.control}"
    padding: "{spacing.3} {spacing.4}"
  nav-item-active:
    backgroundColor: "{colors.light.action-soft}"
    textColor: "{colors.light.action-soft-foreground}"
  nav-item-active-dark:
    backgroundColor: "{colors.dark.action-soft}"
    textColor: "{colors.dark.action-soft-foreground}"

---

# Overview

Morrow is a personal-first workspace for carrying an idea through writing, revision, platform adaptation, publication, and learning. “Make something of today.” The interface should preserve the creator's authorship and make the next useful action clear without turning the product into a chatbot shell or an analytics dashboard.

**Quiet Vitality** is the chosen design direction. Warm paper and ink establish a calm working ground; a restrained green marks meaningful action and progress. Editorial type gives written work a distinct voice, while compact controls and disciplined navigation keep operational tasks clear. The deliberate sacrifice is spectacle and dashboard density in favor of sustained attention and ownership.

This file defines the intended design system, including a future light/dark theme experience and writing-first Studio. It does not claim those behaviors are implemented. Today, `app/layout.tsx` forces the dark class; `/studio` is a manual editor; the optional assistant panel and theme preference are future UX requirements. Base UI is the shared component foundation. UIArc remains a candidate set, and its foundation stylesheet must not be imported without separately resolving its theme conflict (`AGENTS.md`, `docs/uiarc-button-catalog.md`).

The Overtake extraction was consulted as an example of recording a palette, repeated measurements, and component recipes with source context. Its brand colors, type, marketing-scale layout, pill controls, and effects were not carried into Morrow. No additional visual references were supplied or inspected for this system.

The palette and type choices below are evaluated proposals for the approved direction, not accessibility certification or an implementation change. Contrast figures in `docs/morrow-design-system-validation.md` are computed from the listed sRGB hex values using the WCAG relative-luminance formula. They apply only to those exact pairs and do not replace browser-level testing of rendered states.

# Colors

The light composition uses warm paper as the page canvas and white as the writing surface. Those two colors are intentionally close: the measured contrast is 1.08:1, so surface boundaries must also use spacing and a visible border where the boundary carries meaning. Do not depend on a faint color shift alone to identify an input or selected control.

The dark composition is tuned separately. The suggested `#1B1E1B` dark surface is only 1.04:1 against `#111312`; that is too subtle to carry surface hierarchy by itself. It is retained as an inset/editor well. Raised working surfaces use `#222722`, which separates more clearly while remaining quiet. Use border and spacing as well as tone; avoid a stack of nested cards.

The two greens have different jobs by theme. The brighter `#A3D977` is highly legible on the dark canvas (11.33:1) but has only 1.65:1 against white, so it fails as small text there and also cannot carry white button text. It is therefore the dark-theme action and focus color, paired with `#111312`. Light actions use the deeper `#426B35`, which provides 5.73:1 against the warm canvas and 6.20:1 with white button text. Do not use the bright green as light-theme text or as the background for white text. The light/dark pair is a semantic adaptation, not a literal inversion.

Use `action` for primary actions, current selection, and meaningful progress; leave most of the surface neutral. `action-soft` is for selected filters or low-emphasis provenance markers, with its paired foreground. Success may reuse the theme's action green only when the accompanying message explicitly says what succeeded. Error and warning colors are reserved for their respective states, never decoration. Borders have separate subtle and control roles. Focus is a 2px visible ring with a 2px offset; never rely on color alone to show focus.

All component colors must come from the light or dark semantic color roles. Do not put raw palette values in component rules. Keep content, AI suggestions, and approved Brand Brain information distinguishable through labels and layout as well as color; color alone must not encode authorship.

# Typography

Use an editorial serif for display and the largest page-level heading, paired with Inter for interface headings, labels, body copy, and the writing surface. This creates a classification contrast that the current Inter + Space Grotesk pairing does not provide by itself, without making long-form editing decorative. The system font stack `Georgia, "Times New Roman", serif` avoids adding a font dependency and is a proposal to validate with real Morrow copy. Inter is retained provisionally for its clear interface role and because it is already loaded. Space Grotesk's geometric sans voice is therefore not the lead editorial face. Geist Mono is not a general-purpose Morrow face; use a system monospace only for genuinely technical metadata, IDs, or shortcuts.

The scale is deliberately compact. Display type is limited to a page's main editorial moment; screen hierarchy below it uses Inter. The editor uses 18px / 1.65 line-height as a comfortable writing proposal. The target reading measure is 68 characters (`68ch`), not a hard pixel width. Use regular weight for prose, medium for compact labels and controls, and semibold for interface headings. Avoid uppercase tracking as a default; use the label token sparingly for short metadata.

Always consume a named typography recipe. Do not apply display tracking to body or editor text, and do not use mono for decorative numbers or ordinary status labels.

# Layout

The application is a tool for several kinds of attention. Home should prioritize a short next step and recent work, not decorative metric cards. Ideas and Content need browsable, scannable rows with enough metadata to distinguish status, platform, and source relationship. A content detail view should prioritize reading and editing. Studio should keep the writing surface central; the optional AI conversation panel is secondary and must be collapsible or otherwise yield space to writing. The panel is a design requirement, not an existing feature.

Use a persistent 15rem sidebar on roomy desktop layouts, matching the existing `w-60` shell; on narrow layouts use the existing mobile top and bottom navigation model as the implementation reference. The present shell changes at Tailwind's `md` breakpoint, but this document does not establish a new breakpoint. The intended theme preference offers Light, Dark, and System; System follows the operating-system preference. This behavior is future design intent, not current application behavior. Reflow based on available room: preserve a usable writing measure before showing the assistant beside the editor. At constrained widths, the assistant becomes a separate view or overlay rather than compressing the writing column. Keep navigation predictable and avoid adding a permanent third column across all routes.

Use `{layout.content-reading-measure}` for long-form writing and reading; lists, forms, and home summaries may use more width. The current app's `max-w-3xl` is a useful starting container, not a universal maximum for future Studio. When the assistant panel is open, allocate its target width only when the remaining editor still supports comfortable line length. Use `{layout.page-gutter-compact}` and `{layout.page-gutter-wide}` as the page edge rhythm; the latter reflects the current `md:px-8` behavior. Use spacing tokens for internal gaps and distinguish section rhythm from control density.

Keep source-to-draft relationships visible but quiet: use a short “From idea” label, source link, or a narrow provenance marker near the draft metadata. Do not turn every relationship into a large nested card. Dates and statuses should be scannable without interrupting the writing hierarchy.

Responsive behavior is content-first. Maintain reachable navigation and controls, let rows wrap or move secondary metadata, and let the editor fill available width while preserving its reading measure. Do not encode an unsupported breakpoint table or claim the proposed assistant layout is implemented.

# Elevation & Depth

Default depth comes from canvas/surface changes, fine borders, whitespace, and typography. Avoid a card around every item. Use the two floating shadow tokens only for overlays that must separate from surrounding content (menus, dialogs, and a mobile sheet); ordinary rows, writing surfaces, and navigation do not need shadows. The light shadow is tinted with the warm text color rather than generic black. Dark overlays rely primarily on surface separation and boundary; use the listed restrained shadow only when the layer otherwise disappears.

Use a one-pixel subtle divider for grouping, not as a substitute for whitespace. Use the stronger control border where a field's boundary is needed to identify the control. A focused control gets a 2px ring and offset. Hover changes should remain local to the target; active state should be immediate. Disabled controls must communicate unavailable action without opacity alone, and their text must remain readable.

Motion communicates cause and effect. Use the quick duration for hover/focus color response, standard for state feedback, and panel for optional-panel or overlay transitions. Prefer opacity and small transform changes; do not animate typing, saving latency, route navigation, or the content itself. Honor `prefers-reduced-motion`: remove nonessential movement and make state changes immediate. No looping animation, animated gradients, or entrance effects on every page section.

# Shapes

Use a hierarchy, not one radius everywhere: 8px controls, 10px compact rows, 12px meaningful panels, 16px dialogs, and 20px only at the top edge of a bottom sheet. A pill is reserved for a compact status or platform label when the shape improves scanning; primary buttons remain softly rounded rectangles. Do not use the Overtake reference's 100px marketing CTA radius as a Morrow default.

Use 1px borders. Prefer rounded corners for interactive surfaces and meaningful groups; avoid nested rounded containers. Empty states should be typographic and action-oriented before becoming boxed panels. Content rows should gain background or border emphasis only on hover, selection, or a distinct status that needs it.

# Components

Component rules below are design intent. The `components` token map pairs representative states with semantic tokens so a future implementation can map them without copying raw hex values. Theme-specific component entries are separate because the light and dark compositions use different action colors. Base UI remains the current foundation; use its existing shared button when it meets the interaction. Do not replace it with UIArc by default.

- **Primary button:** one clear, high-priority action per working region. Use the theme's action and paired foreground; hover uses `action-hover`. Use the 40px control height, 8px control radius, and a 44×44px minimum touch target when the control is touch-operated. Keep text labels visible for important actions.
- **Secondary and icon buttons:** outline or quiet surface treatment. Icon-only actions need an accessible name and a visible focus ring; reserve them for well-understood actions.
- **Inputs and text areas:** clear persistent labels, readable entered text, visible control boundary, and a focus ring that is not color-only. The writing editor uses the editor type recipe and a wider measure than compact form fields. Errors use text plus border/state cue; do not rely on red alone.
- **Navigation:** preserve labels with icons, show active location using both a restrained accent cue and accessible current-page semantics, and keep keyboard focus visible. Mobile navigation follows the current bottom bar/More pattern until separately redesigned.
- **Content rows:** use list rows for Ideas and Content by default. Show title/body preview, date or status, platform, and provenance only when useful. Reserve a bordered card for a meaningful grouped preview, not each row.
- **Status indicators:** pair a concise text label with color or icon. “Draft,” “approved,” “scheduled,” and “published” are different workflow facts; a planned date never implies external publication. Future states must not be described as implemented.
- **Empty states:** explain what belongs here and offer one direct next action. Keep the copy calm and useful; do not invent statistics or manufacture urgency.
- **Dialogs and menus:** use the dialog/tooltip recipes for contrast and boundaries. Preserve keyboard operation, Escape dismissal where appropriate, focus containment/restoration for modal dialogs, and reduced-motion behavior. The current mobile sheet declares a modal but its focus behavior has not been audited.
- **Writing surface:** make creator-authored text the strongest content on screen. Keep assistant suggestions visually and semantically distinct, preserve source-idea links, and never style AI output as approved creator content by default.
- **Optional assistant panel:** future Studio pattern only. It must be secondary, dismissible, and labeled as assistance; opening it must not erase or silently replace creator work. Maintain a separate conversation history from saved content as required by the PRD.

# Do's and Don'ts

**Do**

- Keep the draft or idea itself at the center of its editing view.
- Use warm neutral surfaces and theme-specific semantic colors; evaluate each foreground/background pair rather than assuming a palette is accessible.
- Use the deep green for light-theme actions and the brighter green for dark-theme actions; pair each with its tested foreground.
- Preserve the creator's original idea and clearly label provenance and AI suggestions.
- Use editorial serif type for the display role and Inter for practical reading and interface roles unless later specimen review changes that decision.
- Use spacing and borders before shadows to distinguish surfaces.
- Make focus visible, preserve keyboard access, and honor reduced-motion preferences.
- Describe calendar, Brand Brain, AI generation, and publishing UI as future scope until implementation confirms otherwise.

**Don't**

- Use `#A3D977` for small text on light surfaces or pair it with white text as a light-theme button.
- Use `#1B1E1B` as the only elevated dark surface over `#111312`; their difference is too small to establish hierarchy alone.
- Add gradients, glass, neon glow, decorative chart cards, or shadows without a functional reason.
- Put the AI conversation before the writing surface or make it mandatory to edit content.
- Use green as a general decoration, or communicate success/error/selection by color alone.
- Apply pill radii to every button, card, or input.
- Use Space Grotesk or Geist Mono as default body text, or introduce extra font families without a specimen-based reason.
- Animate routine saving, typing, or navigation in a way that delays work.
- Treat current placeholder routes or the optional assistant panel as implemented features.
