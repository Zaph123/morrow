# UIArc button catalog for Morrow

Verified against the Arc MCP component details and installed source on 2026-10-18. This is a selection guide for the button-specific family, not a recommendation to use every entry in product UI.

## Scope and status

UIArc has no standalone “Buttons” category endpoint. Its official `button` entry names four related items and five “Also in buttons” items. Together with `button`, these are the complete 10-entry button family. The broader Actions listing contains 19 entries; dropdown menus, context menus, user menus, theme switches, reactions, and swipe actions are adjacent action components, not part of this button family, and were not installed here.

| UIArc entry | Project location | Status | Distinction |
| --- | --- | --- | --- |
| `button` | `components/arc/button/` | Already present; inspected, retained | General purpose button with four visual variants, three sizes, loading state, and animated label changes. |
| `action-button` | `components/arc/action-button/` | Installed | Async action with pending and success feedback in place. |
| `split-button` | `components/arc/split-button/` | Installed | One default action plus a separate menu of alternatives. |
| `button-group` | `components/arc/button-group/` | Installed | Related labeled/icon actions presented as a compact group, optional trailing menu. |
| `floating-button-group` | `components/arc/floating-button-group/` | Installed | Floating or muted toolbar with tooltip support and toolbar keyboard behavior. |
| `expanding-button-group` | `components/arc/expanding-button-group/` | Installed | Space-saving icon actions that reveal labels and can confirm an action in place. |
| `copy-button` | `components/arc/copy-button/` | Installed | Clipboard action with copied/error feedback. |
| `icon-morph` | `components/arc/icon-morph/` | Installed | Decorative two-state animated SVG icons to place inside an accessible control. |
| `confirm-morph` | `components/arc/confirm-morph/` | Installed | Destructive action with inline confirm, pending, result/error, and optional undo states. |
| `hold-to-confirm` | `components/arc/hold-to-confirm/` | Installed | Destructive action requiring a press-and-hold gesture. |

The existing product-wide component at `components/ui/button.tsx` is Base UI with Morrow's current Tailwind/shadcn variants. It is widely used and was not overwritten. Prefer it for routine actions when it satisfies the need. The Arc `Button` is a separate candidate and currently appears in the button comparison route; it is not a replacement for the shared Base UI button.

## Choosing between similar components

| Need | Prefer | Choose another when |
| --- | --- | --- |
| One ordinary action, optional spinner/loading label | Existing `@/components/ui/button`; Arc `Button` only when its morphing/presentation is specifically desired and approved | The action needs built-in async success feedback (`ActionButton`) or has alternatives (`SplitButton`). |
| Async save/send action whose result should be visible on the control | `ActionButton` | A plain loading state is sufficient, the action is part of a form submit flow, or the result needs richer explanation. |
| Default action with secondary choices | `SplitButton` | All choices are peers; use a menu or a regular group instead. |
| Several peer actions visible together | `ButtonGroup` | They are persistent selected views/states; use a selection control. |
| Compact contextual editor/canvas toolbar | `FloatingButtonGroup` | Actions should be ordinary page controls or touch users need every label visible. |
| Dense set of secondary actions with labels revealed on demand | `ExpandingButtonGroup` | Actions must be immediately self-explanatory on touch; its first tap expands, second tap acts. |
| Copy one known value | `CopyButton` | Copy has formats/options, or the control is a full code-block action bar. |
| Animate a supported two-state glyph inside another control | `IconMorph` | The icon is static, the state is not one of its supported shapes, or no parent control will provide an accessible name/state. |
| Destructive action needing a quick inline second step and optional undo | `ConfirmMorph` | Confirmation needs explanation, typed input, or a larger decision surface; use a dialog. |
| High-consequence destructive action where accidental activation must be difficult | `HoldToConfirm` | The delay/gesture would harm discoverability or accessibility; prefer a clearly labeled confirmation step. |

## Component details and verified usage

Examples below use the installed exports and props. They are minimal shapes; wire real handlers and labels appropriate to the action. All entries are free and marked installable in the Arc catalog. Motion is already a Morrow dependency. `lucide-react` was already present. The install added `@radix-ui/react-dropdown-menu` (used by split/group menus) and `@radix-ui/react-tooltip` (used by the floating group tooltip); both now appear in the project dependencies. The registry also installed `components/arc/tooltip/` and shared copy-feedback helper because the button entries import them. These are support files, not extra button-category entries.

### `button` — `components/arc/button/button.tsx`

**Purpose/capabilities:** General native button with `primary | secondary | ghost | danger`, `sm | md | lg`, `loading`, standard button attributes, animated content/width morphing, and a press response. Loading stays focusable, reports busy/disabled semantics, and blocks further activation. Reduced motion is respected.

**Use:** A conventional button when the Arc presentation is specifically desired. **Avoid:** replacing Morrow's shared Base UI button by default, or using it where async success/error feedback needs its own full behavior.

**A11y:** Supply visible text or an accessible name for icon-only content; preserve native button type/disabled semantics. Loading retains focus. Motion responds to reduced-motion preference.

```tsx
import { Button } from "@/components/arc/button/button"

<Button type="button" variant="secondary" size="md" loading={saving}>
  Save draft
</Button>
```

### `action-button` — `components/arc/action-button/action-button.tsx`

**Purpose/capabilities:** Runs `onAction(): Promise<void>` and transitions through idle, pending, and temporary success labels; accepts `label`, `pendingLabel`, `successLabel`, `resetAfterMs`, `onActionError`, and native button props. Errors return to idle and reach the optional error callback.

**Use:** One async commit whose result can be announced in place (for example, save). **Avoid:** synchronous actions or flows whose errors need substantial inline explanation.

**A11y:** Native button, keeps focus during pending, uses busy/disabled state and a live status announcement. Reduced-motion behavior is built in.

```tsx
import { ActionButton } from "@/components/arc/action-button/action-button"

<ActionButton label="Save draft" onAction={saveDraft} />
```

### `split-button` — `components/arc/split-button/split-button.tsx`

**Purpose/capabilities:** Main action (`label`, `onClick`) with adjacent Radix dropdown containing `actions` (`label`, optional `onSelect`, `disabled`, `destructive`, `icon`); supports optional icon and `primary | secondary` styling. Main label/icon morph; menu remains a stable anchor.

**Use:** A frequent default action with closely related alternatives. **Avoid:** when choices have equal priority or the control becomes too narrow; the main segment has a 142px minimum width in its stylesheet.

**A11y:** Radix menu supplies menu keyboard behavior; retain clear action labels and verify the menu trigger name in context. Dropdown requires `@radix-ui/react-dropdown-menu`.

```tsx
import { SplitButton } from "@/components/arc/split-button/split-button"

<SplitButton label="Publish" onClick={publish} actions={[
  { label: "Schedule", onSelect: schedule },
]} />
```

### `button-group` — `components/arc/button-group/button-group.tsx`

**Purpose/capabilities:** `items` can be buttons or links with labels/icons, optional icon-only, reserved alternate labels, and content. Supports `outline | solid`, `sm | md`, horizontal/vertical layout, optional overflow menu, disable-all, and responsive label collapse.

**Use:** A small set of related peer actions (for example, editor formatting commands). **Avoid:** persistent selection, tabs, or unrelated actions.

**A11y:** Give the group a descriptive `label`; segments retain names even when icon-only. Menu uses Radix dropdown. Each action is reachable by keyboard; test compact/collapsed presentation with screen reader and keyboard.

```tsx
import { ButtonGroup } from "@/components/arc/button-group/button-group"

<ButtonGroup label="Draft actions" items={[
  { id: "copy", label: "Copy", onSelect: copyDraft },
  { id: "share", label: "Share", onSelect: shareDraft },
]} />
```

### `floating-button-group` — `components/arc/floating-button-group/floating-button-group.tsx`

**Purpose/capabilities:** Contextual toolbar with `items`, accessible `label`, `muted | floating` variant, `sm | md`, horizontal/vertical orientation, icon-only mode, tooltip side, and async `onAction` handling.

**Use:** A compact toolbar attached to an editing/canvas context. **Avoid:** global primary navigation, persistent toggles, or essential actions whose names should always remain visible.

**A11y:** Uses toolbar semantics and roving keyboard navigation; icon actions need meaningful names/tooltips. Tooltip helper uses `@radix-ui/react-tooltip`. Ensure mobile touch targets and visible labels remain adequate.

```tsx
import { FloatingButtonGroup } from "@/components/arc/floating-button-group/floating-button-group"

<FloatingButtonGroup label="Text selection" items={[
  { id: "bold", label: "Bold", icon: <Bold />, pressed: isBold, onSelect: toggleBold },
]} />
```

### `expanding-button-group` — `components/arc/expanding-button-group/expanding-button-group.tsx`

**Purpose/capabilities:** Dense labeled actions with `items`, `label`, `sm | md`, optional `defaultExpanded`, async `onAction`, and configurable `confirmDuration`; supports neutral/danger item tones and confirmation feedback.

**Use:** Secondary actions in tight desktop contexts where a first tap/click can reveal labels. **Avoid:** primary or touch-critical actions; on touch, first activation expands and a later activation runs the item.

**A11y:** Group has an accessible label and toolbar-style keyboard behavior. Confirm labels/status and touch discoverability when using it; honor reduced motion.

```tsx
import { ExpandingButtonGroup } from "@/components/arc/expanding-button-group/expanding-button-group"

<ExpandingButtonGroup label="More draft actions" items={[
  { id: "duplicate", label: "Duplicate", icon: <Copy /> },
]} onAction={runDraftAction} />
```

### `copy-button` — `components/arc/copy-button/copy-button.tsx`

**Purpose/capabilities:** Copies `value`; `label`, `iconOnly`, `outline | plain`, `disabled`, and `onCopied` configure it. Shows copied or error feedback and reserves room for the changed label.

**Use:** A single known value such as a share link. **Avoid:** multiple copy formats or a code block with related controls.

**A11y:** Accessible name is retained for icon-only mode and feedback is announced; verify error feedback for the actual browser clipboard permissions/context. Uses the installed copy-feedback helper and `lucide-react`.

```tsx
import { CopyButton } from "@/components/arc/copy-button/copy-button"

<CopyButton value={shareUrl} label="Copy link" />
```

### `icon-morph` — `components/arc/icon-morph/icon-morph.tsx`

**Purpose/capabilities:** `IconMorph` accepts one of `menu | play | plus | copy | theme | chevron | bell | heart` and `state`; named exports include `MenuIcon`, `PlayPauseIcon`, `PlusCheckIcon`, `CopyCheckIcon`, `SunMoonIcon`, `ChevronIcon`, `BellIcon`, `HeartIcon`. Size and stroke width are configurable; selected icons include a ring/burst moment.

**Use:** A supported state change where a moving glyph helps communicate the change. **Avoid:** as a standalone control or for unsupported icon pairs.

**A11y:** SVG is decorative/hidden. The parent button must provide the accessible name and accurate `aria-pressed`, `aria-expanded`, or equivalent state. Honors reduced motion.

```tsx
import { HeartIcon } from "@/components/arc/icon-morph/icon-morph"

<button type="button" aria-label="Like" aria-pressed={liked}>
  <HeartIcon state={liked} />
</button>
```

### `confirm-morph` — `components/arc/confirm-morph/confirm-morph.tsx`

**Purpose/capabilities:** Inline destructive confirmation with `idle | confirming | pending | done | error`, configurable press/hold/countdown mode, async completion/error, optional undo, and morphing status labels. Consult the installed `ConfirmMorphProps` for its full controlled/uncontrolled options.

**Use:** Reversible or clearly scoped destructive action where inline confirmation provides enough context. **Avoid:** actions needing an explanation, typed confirmation, or a multi-step decision; use a dialog.

**A11y:** Inspect the exact mode/announcement behavior before use; ensure the confirm/cancel labels remain explicit and keyboard reachable. Reduced motion is supported.

```tsx
import { ConfirmMorph } from "@/components/arc/confirm-morph/confirm-morph"

<ConfirmMorph label="Delete draft" onConfirm={deleteDraft} />
```

### `hold-to-confirm` — `components/arc/hold-to-confirm/hold-to-confirm.tsx`

**Purpose/capabilities:** Requires holding for `duration` (default 1200ms), then invokes `onConfirm`; accepts `label`, `confirmedLabel`, optional icon, tone, controlled `confirmed`, hold-progress callback, and native button props.

**Use:** High-consequence action where extra deliberate effort is justified and holding can be explained. **Avoid:** routine deletion or mobile flows where hold gestures are unexpected; its friction can impair discoverability.

**A11y:** Supports pointer/touch and keyboard interaction, provides a described hold hint and status feedback. Check the instruction is perceivable and the hold remains operable without precision. Honors reduced motion.

```tsx
import { HoldToConfirm } from "@/components/arc/hold-to-confirm/hold-to-confirm"

<HoldToConfirm label="Permanently delete" onConfirm={deleteAccount} />
```

## Integration and compatibility notes

- Registry: `components.json` maps `@uiarc` to `https://uiarc.dev/r/{name}.json`. Install documented free items with the shadcn CLI; use the Arc MCP install command when available. Do not guess registry IDs.
- Dependencies: `motion` and `lucide-react` were existing dependencies. Installing the nine missing entries added Radix dropdown-menu and tooltip dependencies. Check package/lockfile before any future installation to avoid duplicates.
- Theme: `components/arc/foundation.css` is installed but intentionally not imported in `app/layout.tsx`. It defines global root tokens, a neutral dark theme behind `html[data-theme="dark"]`, and typography/token assumptions that conflict with Morrow's existing `.dark` palette and brand tokens. Import only after a deliberate token mapping and review; current stylesheet installation alone does not make the Arc visuals product-ready.
- Existing component choice: `components/ui/button.tsx` is the established Base UI/shadcn implementation and is used across the application. Reuse it when sufficient. A new Arc button pattern or replacement of the shared button requires the approval process in `AGENTS.md`.
- This category was installed and its source paths, imports, and dependencies were inspected. Visual and interaction testing of all ten entries has not been performed. The detailed props in each installed `.tsx` source and the Arc skill remain authoritative if an example or need is more specific.
