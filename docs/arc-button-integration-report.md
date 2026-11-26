# Arc Button Integration Report

**Date:** 2026-10-17  
**Status:** ✅ Successfully Integrated  
**Test URL:** http://localhost:3000/button-comparison

## Summary

Successfully installed and verified Arc's button component alongside the existing Base UI button. The integration demonstrates Arc's Motion-powered animations, width morphing, and shared motion tokens.

## What Was Installed

### 1. Arc Button Component
**Location:** `components/arc/button/`
- `button.tsx` - Main component with Motion animations
- `button.module.css` - CSS modules with semantic tokens

**Key Features:**
- Width morphs smoothly when label changes (e.g., "Save" → "Saved")
- Press feedback with spring physics (scale to ~0.97)
- Built-in loading states with spinner
- Label crossfades with subtle blur
- Respects `prefers-reduced-motion`
- Keeps button focusable during loading (uses `aria-busy`)

### 2. Motion Tokens Utility
**Location:** `components/arc/motion-tokens.ts` and `components/arc/lib/motion-tokens.ts`

**Available Tokens:**
```typescript
motionTokens = {
  spring: {
    snappy: { visualDuration: 0.26, bounce: 0.12 },  // Presses, toggles
    smooth: { visualDuration: 0.4, bounce: 0 },      // Panels, no overshoot
    morph: { visualDuration: 0.42, bounce: 0.16 }    // Highlights, width changes
  },
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    standard: [0.22, 1, 0.36, 1],
    inOut: [0.65, 0, 0.35, 1]
  },
  blur: { subtle: 2, soft: 4, text: 8 },
  stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 }
}
```

## Comparison: Arc vs Base UI Button

### Arc Button (Motion-powered)
✅ Width morphs smoothly when content changes  
✅ Spring-based press feedback (~0.97 scale)  
✅ Built-in loading spinner with smooth transitions  
✅ Label crossfades with blur during changes  
✅ Respects `prefers-reduced-motion`  
✅ Uses `aria-busy` (keeps focus during loading)  
✅ No scale on popup anchors (preserves layer positioning)  

### Base UI Button (Current)
❌ No width morphing (jumps to new size)  
❌ CSS transitions only (no spring physics)  
❌ No built-in loading states  
❌ No label crossfade animations  
⚠️ Basic reduced motion support  
⚠️ Uses `disabled` for loading (loses focus)  
✅ Simpler implementation  

## Build Verification

Production build completed successfully:
```bash
✓ Compiled successfully in 33.3s
✓ TypeScript check passed (27.7s)
✓ Generated 10 static pages in 4.0s
```

**No errors, no warnings, no type issues.**

## Motion Implementation Analysis

### Current Violations Found
1. **Base UI Button:** Uses `transition-all` (should animate only needed properties)
2. **No Reduced Motion Strategy:** Missing comprehensive `prefers-reduced-motion` handling
3. **No Shared Motion Conventions:** Each component handles motion independently

### Arc Motion Principles Compliance
✅ Animates only `transform`, `opacity`, `filter` (blur)  
✅ Width springs when content changes (the information IS the size change)  
✅ One continuous gesture per interaction  
✅ Everything interruptible (spring physics)  
✅ Press feedback ~0.97 scale  
✅ Exits faster than entrances  
✅ Reduced motion branch on every animation  
✅ Element stays mounted during animation  

## Motion Tokens Usage Example

```tsx
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/components/arc/lib/motion-tokens";

const reduce = useReducedMotion();

// Press feedback
<motion.button
  whileTap={reduce ? undefined : { scale: 0.97 }}
  transition={motionTokens.spring.snappy}
>

// Panel animation
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  transition={reduce ? { duration: 0 } : motionTokens.spring.smooth}
>

// Shared highlight (tabs, segmented control)
<motion.span
  layoutId="highlight"
  transition={reduce ? { duration: 0 } : motionTokens.spring.morph}
/>
```

## Integration Strategy Validated

### UIArc MCP Access ✅
- OAuth authenticated to `https://uiarc.dev/api/mcp`
- Successfully searched and retrieved component documentation
- Can install any Arc component via: `npx shadcn@latest add https://uiarc.dev/r/{id}.json`

### Component Discovery Workflow ✅
1. Search via MCP: `mcp__arc__search_components`
2. Get details: `mcp__arc__get_component`
3. Install: `npx shadcn@latest add https://uiarc.dev/r/{id}.json`
4. Import: `import { Component } from "@/components/arc/{id}/{id}"`
5. Wire with documented props only
6. Review with Arc checklist

### Compatibility Verified ✅
- Next.js 16.4.2: ✅ Compatible
- React 19.3.0: ✅ Compatible  
- Motion 14.3.0: ✅ Installed and working
- TypeScript 5: ✅ No type errors
- Tailwind CSS 4: ✅ Works with CSS variables

## Recommendations

### Immediate Actions
1. ✅ Test button comparison page: http://localhost:3000/button-comparison
2. ✅ Click "Save draft" buttons to observe width morphing animation
3. ✅ Compare press feedback between Base UI and Arc buttons
4. ✅ Verify reduced motion support (enable in OS settings)

### Future Implementation
1. **Gradual Migration:** Replace Base UI buttons with Arc buttons on a per-component basis
2. **Shared Motion Patterns:** Use `motionTokens` for all custom animations
3. **Consistent Press Feedback:** Apply spring-based press to all interactive elements
4. **Width Morphing:** Use on buttons where label changes ("Save" → "Saved")
5. **Reduced Motion:** Add `useReducedMotion()` branch to all animations

### Additional Arc Components to Consider
Based on Morrow's UX/UI specification needs:
- `input` - Form inputs with focus transitions
- `switch` - On/off toggles with smooth thumb animation
- `tabs` - Navigation with morphing highlight
- `dialog` - Modals with smooth entrance/exit
- `drawer` - Side panels for contextual content
- `segmented-control` - View switchers (2-5 options)
- `date-picker` - Calendar selection
- `sortable-data-table` - Content library tables

## Motion Principles for Morrow

From `docs/morrow-UXUI_Design_Specification.md` Section 13:

**Appropriate Motion:**
- Subtle transitions when opening contextual panels ✅ Arc's `spring.smooth`
- Brief confirmation when items saved ✅ Arc button's morph
- Smooth transitions between workspace views ✅ Arc's layout animations
- Restrained appearance for generation results ✅ Arc's fade patterns

**Avoid:**
- Long entrance animations ✅ Arc uses fast durations
- Constantly moving elements ✅ Arc animates on interaction only
- Animated gradients ✅ Not present in Arc
- Motion that delays actions ✅ Arc respects reduced motion

## Conclusion

**Status:** Arc button integration successful. All prerequisites met for broader Arc adoption.

**Next Step:** Evaluate Arc button in actual Morrow screens (Ideas capture, Content library actions, AI Studio controls) before deciding on full migration strategy.

**Files Changed:**
- ✅ `components/arc/button/button.tsx` (installed)
- ✅ `components/arc/button/button.module.css` (installed)
- ✅ `components/arc/motion-tokens.ts` (installed)
- ✅ `components/arc/lib/motion-tokens.ts` (installed)
- ✅ `app/(workspace)/button-comparison/page.tsx` (created for testing)

**Build Status:** ✅ Production build passes with zero errors
**Type Check:** ✅ TypeScript validation passes
**Runtime:** ✅ Dev server running on http://localhost:3000
