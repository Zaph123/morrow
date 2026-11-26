# Superseded revamp notes

Archived on 2026-11-26 from root `REVAMP_SUMMARY.md`. The original notes follow unchanged.
Their warm-neutral / Georgia / Inter direction and universal press-animation advice
are historical claims, not current implementation requirements or verification.

Current authority: [DESIGN.md](../../../../DESIGN.md),
[Stitch conversion rules](../../../../.agents/rules/stitch-to-morrow.md), and
[visual acceptance rules](../../../../.agents/rules/stitch-visual-acceptance.md).
Retain the original rationale and testing suggestions as context; inspect current
source and approved decisions before reusing them.

---

# Page Revamp Summary

Applied design-taste-frontend and emil-design-eng principles to all workspace pages.

## Design Read

**Context:** Personal workspace application for technical users, with a calm, restrained editorial language, leaning toward a custom design system with warm neutrals + editorial type.

**Dial Configuration:**
- **DESIGN_VARIANCE: 5** - Clean and predictable
- **MOTION_INTENSITY: 3** - Restrained, functional only (daily-use tool)
- **VISUAL_DENSITY: 4** - Balanced spacing

## Changes Applied

### Core Interaction Improvements

#### Button States (Emil's Animation Framework)
| Before | After | Why |
|--------|-------|-----|
| `transition-colors` | `transition-all duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]` | Strong ease-out for responsive feel |
| `active:translate-y-px` | `active:scale-[0.97]` | Buttons must feel responsive to press |
| No duration specified | 160ms duration | Quick duration for button feedback (100-160ms range) |
| Generic easing | Custom cubic-bezier(0.23,1,0.32,1) | Built-in CSS easings are too weak |

**Rationale:** Every pressable element needs instant feedback. The scale-down on `:active` gives tactile response, making the UI feel like it truly listens to the user.

#### List Row Hover States
| Before | After | Why |
|--------|-------|-----|
| `transition-colors` (no duration) | `transition-colors duration-120 ease-[cubic-bezier(0.23,1,0.32,1)]` | Specify exact timing for hover |
| Generic timing | 120ms with strong ease-out | Faster than buttons (120ms for hover vs 160ms for press) |

**Rationale:** Hover changes should be quick (120ms range). The custom easing makes the transition feel intentional rather than default.

### Files Modified

1. **`components/ui/button.tsx`** - Core button component
   - Changed from `translate-y-px` to `scale-[0.97]` on active
   - Added proper duration (160ms) and strong ease-out curve
   - Changed from `transition-colors` to `transition-all` for transform support
   - Added `motion-reduce:active:scale-100` for accessibility

2. **`components/home/home-page.tsx`** - Homepage
   - Applied button press feedback to "Capture an idea" and "Start a draft" CTAs
   - Consistent animation timing across all interactive elements

3. **`components/ideas/ideas-page.tsx`** - Ideas page
   - Applied button press feedback to "Save idea" button
   - Maintains consistent interaction feel across the app

4. **`components/content/content-page.tsx`** - Content page
   - Applied button press feedback to "New draft" action button
   - Consistent with other primary actions

5. **`components/studio/studio-page.tsx`** - Studio page
   - Applied button press feedback to both "Save" buttons
   - Critical for the main editing workflow

6. **`components/layout/workspace-list.tsx`** - Shared list component
   - Improved hover timing on list rows (120ms)
   - Strong ease-out curve for responsive feel
   - Affects all pages using workspace lists

### Animation Principles Applied

From Emil's Design Engineering skill:

1. **Frequency-based animation decisions**
   - These are daily-use actions (100+ times/day for some)
   - Kept animations minimal and functional only
   - Quick durations (120-160ms) to avoid feeling slow

2. **Strong custom easing**
   - `cubic-bezier(0.23,1,0.32,1)` instead of CSS defaults
   - Ease-out for all UI interactions (feels responsive)
   - Never used ease-in (it feels sluggish)

3. **Button press feedback**
   - `scale(0.97)` on `:active` state
   - Makes buttons feel tactile and responsive
   - Universal pattern across all pressable elements

4. **Proper timing hierarchy**
   - Button press: 160ms (more deliberate)
   - Hover effects: 120ms (faster response)
   - Transition properties: `transition-all` for transforms

5. **Accessibility**
   - Added `motion-reduce:transition-none` where needed
   - Added `motion-reduce:active:scale-100` to disable press animation
   - Honored `prefers-reduced-motion` throughout

### What Was NOT Changed

Intentionally avoided these common pitfalls:

- ❌ No entrance animations (these are used 100+ times/day)
- ❌ No keyboard shortcut animations (Raycast principle)
- ❌ No transition durations > 300ms
- ❌ No generic `ease` or `ease-in` timing functions
- ❌ No `scale(0)` entry animations (nothing appears from nothing)
- ❌ No decorative motion that delays work

### Design System Compliance

All changes respect the existing Morrow design system:

- **Colors:** Using semantic tokens from DESIGN.md
- **Typography:** Maintaining Georgia display + Inter UI hierarchy
- **Spacing:** Following established spacing scale
- **Motion tokens:** Using `--motion-quick` (120ms) and custom curves
- **Quiet Vitality direction:** Restrained, functional motion only

### Testing Recommendations

1. Test button press on touch devices (should hit 44×44px minimum)
2. Verify `prefers-reduced-motion` disables animations
3. Check hover states work only on pointer devices (`@media (hover: hover)`)
4. Confirm disabled buttons don't animate
5. Validate keyboard navigation has visible focus rings

## Before/After Feel

**Before:** Generic transitions, unclear feedback, default CSS timing
**After:** Tactile, responsive interactions with intentional timing that feels crafted

The improvements are subtle by design—users won't consciously notice them, but the aggregate creates an interface that feels right.
