---
{
  "version": "alpha",
  "name": "Morrow",
  "description": "Light neutral creator workspace with DM Sans and lime primary actions.",
  "colors": {
    "canvas": "#F5F5F7",
    "surface": "#FFFFFF",
    "text": "#121316",
    "secondaryText": "#5E636E",
    "border": "#E5E6EB",
    "neutralControl": "#ECECEF",
    "primary": "#D4FC30",
    "onPrimary": "#121316",
    "desktopSelection": "#F2FCD6",
    "mobileNav": "#121316",
    "mobileSelection": "#2F3132",
    "errorAndDanger": "#BA1A1A",
    "disabledText": "#8E94A0",
    "focus": "#536600"
  },
  "typography": {
    "sans": {
      "fontFamily": "DM Sans"
    },
    "pageHeading": {
      "fontFamily": "DM Sans",
      "fontSize": "24px",
      "lineHeight": "32px",
      "fontWeight": 600
    },
    "settingsLabel": {
      "fontFamily": "DM Sans",
      "fontSize": "15px",
      "lineHeight": "20px",
      "fontWeight": 500
    },
    "mobileFormText": {
      "fontFamily": "DM Sans",
      "fontSize": "16px"
    },
    "supportingText": {
      "fontFamily": "DM Sans",
      "fontSize": "13px",
      "lineHeight": "18px"
    }
  },
  "rounded": {
    "capture": "20px",
    "workingSurface": "16px",
    "standardControl": "12px",
    "compactControl": "8px",
    "pill": "9999px"
  },
  "spacing": {
    "mobileSidePadding": "24px",
    "mobilePageTopPadding": "64px",
    "mobileMinimumTouchTarget": "44px"
  }
}
---

## Overview

Morrow is a personal creator workspace for capturing ideas, developing writing and shaping a deliberate writing voice. Its current design uses light neutral surfaces, DM Sans and lime primary actions.

## Colors

Use lime with charcoal text for enabled primary actions. Use neutral controls for secondary actions and muted disabled treatment when an action cannot run. Use the danger role for sign-out and error feedback.

Keep the desktop sidebar white with pale selected rows. The mobile navigation has a charcoal surface and a distinct selected pill. Keep the replaceable profile-cover gradient local to the cover.

## Themes

Implement the approved light presentation as the current reference. A new dark presentation requires a separate design decision.

## Typography

Use DM Sans throughout the application, including adopted Arc components. Keep settings labels subordinate to page headings and retain readable mobile form text. Do not enlarge Learning section headings relative to the other Brand Brain tabs.

## Layout

Use a shared desktop shell and route-appropriate content widths. Profile and Account share the same container, cover and identity header. Keep a global narrow reading width from constraining Studio or shrinking the Account layout.

Anchor the avatar to the cover-only wrapper with its center on the cover's bottom edge. Keep the name and helper text beside the lower half of the avatar and reserve space before the tabs; wrapped mobile text must not collide with them.

Keep the selected tab visible when Brand Brain tabs scroll horizontally. Preserve bottom clearance for the mobile navigation and use the active-writing navigation treatment in Studio.

## Elevation & Depth

Use flat inputs with subtle borders consistently across matching forms. Do not add drop shadows to one tab's inputs while equivalent inputs in other tabs remain flat.

Keep populated settings rows separated by spacing and subtle rules. In Learning, use a white card for a pending suggestion and flat entries for approved preferences.

## Shapes

Use the capture, working-surface and control radius roles for their respective responsibilities. Avatars remain circular. Keep the mobile navigation and the Add context trigger pill-shaped.

## Components

Keep the existing shadcn/Base UI primitives as the baseline and adopt Arc selectively for useful interactions. Map adopted Arc styling to Morrow's tokens; do not globally import its stock foundation over the application theme or replace the shared button merely for visual variety.

Use the supplied Brain SVG consistently across desktop and mobile. Keep Home, Studio, Library, Ideas and Brand Brain in the mobile bar. On You, preserve the explicitly requested selected Brain pill as a visual exception without marking a different route as the current page for assistive technology.

Put desktop sign-out in the sidebar footer below You with danger treatment. Keep the selected destination distinct from secondary controls.

Keep Profile and Account under You; Brand Brain holds writing identity and preferences. Learning has To review and Approved preferences sections with counts. Hide empty Patterns & examples rather than adding another empty section.

Make motion purposeful, interruptible and compatible with reduced-motion preferences. Use the installed motion system for adopted interactions; do not add decorative looping animation or animate repeated keyboard input.

Home retains its compact auto-growing composer and unchanged resting/focused appearance. Later approved refinements supersede the older 26 November Home card notes: white cards at rest and hover, a semantic neutral hover border, at most a 1px fine-pointer lift, visible View all links in populated card headers, a 16px group inset on the three-column desktop layout, and a native horizontal rail on narrow layouts. Rail cards begin near 82% width, capped near 280px; preserve next-card preview, hidden scrollbar, keyboard access and native touch/vertical scrolling. Mouse drag/glide must suppress accidental links and competing snap/press effects. Keep one recent record per relevant card, full stored text, two-line visual previews and equal compact card heights. Empty collections hide View all; Blank draft comes first on mobile when no draft exists. The older single-column, detached-link and gray-hover notes are superseded by these later user corrections.

Home's action-card icon and heading direction intentionally uses category accents: cool violet for Continue, warm ochre for Revisit an idea, and teal for Blank draft. This is an approved revision to the neutral-only source treatment. The direction is accepted; the exact rendered shades remain open for visual review and are not accepted by this note.

## Do's and Don'ts

Do preserve written geometry and state contracts when export previews are incomplete. Do use one shared component for repeated responsibilities.

Do not substitute a different Brain icon, use charcoal for enabled primary actions, or copy conflicting generated theme tokens from old exports. Do not use paper illustrations as profile avatars. Do not auto-apply AI proposals or permanent learning preferences.
