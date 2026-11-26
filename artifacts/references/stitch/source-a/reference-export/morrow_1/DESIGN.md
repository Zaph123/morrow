---
version: alpha
name: Morrow
description: Foundational design direction for a personal-first creator workspace.
typography:
  sans:
    fontFamily: DM Sans
  headline-xl:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
colors:
  primary: '#D4FC30'
  on-primary: '#111315'
  primary-container: '#F2FCD6'
  on-primary-container: '#111315'
  surface-tint: '#D4FC30'
  secondary: '#121316'
  on-secondary: '#FFFFFF'
  secondary-container: '#ECECEF'
  on-secondary-container: '#121316'
  tertiary: '#5E636E'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#ECECEF'
  on-tertiary-container: '#121316'
  background: '#F5F5F7'
  surface: '#F5F5F7'
  surface-bright: '#FAFAFB'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FAFAFB'
  surface-container: '#F5F5F7'
  surface-container-high: '#ECECEF'
  surface-container-highest: '#E5E6EB'
  on-surface: '#121316'
  on-background: '#121316'
  on-surface-variant: '#5E636E'
  outline: '#8E94A0'
  outline-variant: '#E5E6EB'
  focus-ring: '#536600'
  surface-dim: '#d9dadc'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  inverse-primary: '#b0d500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbf223'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#e3e2e6'
  secondary-fixed-dim: '#c7c6ca'
  on-secondary-fixed: '#1b1b1f'
  on-secondary-fixed-variant: '#46464a'
  tertiary-fixed: '#dee2ef'
  tertiary-fixed-dim: '#c2c6d3'
  on-tertiary-fixed: '#171c25'
  on-tertiary-fixed-variant: '#424751'
  surface-variant: '#e2e2e4'
  destructive: '#DC2626'
omitted:
- section: rounded
  reason: No product-wide shape scale has been agreed.
- section: spacing
  reason: Layout density and spacing scales remain under visual exploration.
- section: components
  reason: Shared component contracts have not been established.
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Overview
Morrow is a personal-first, AI-assisted creative workspace that helps a creator
capture unfinished thoughts, develop authentic social content, and return to
work over time. Its brand promise is “Make something of today.”
Design for Possibility, Continuity, and Ownership: make beginning approachable,
keep work and its source connected, and preserve the creator's voice and control.
AI supports the work; it does not define the entire product identity.
The visual direction is a personal creative studio with clear typography,
balanced neutral surroundings, selective acid-lime emphasis, and layered
working surfaces. This foundation guides further screen design rather than
prescribing a complete component system.

## Colors
Use balanced neutrals as the dominant environment: white working surfaces,
near-neutral grey surroundings, and charcoal text. Keep strong cream or blue
casts out of the foundation.
Use acid lime as the signature accent. Concentrate it on the main creation
action and selected details so the creator's content retains visual priority.
Pair bright lime fills with dark text. For selected navigation, use a pale lime
treatment with a dark readable label. Keep ordinary body text charcoal rather
than applying lime to text on white.
Primary buttons are acid-lime #D4FC30 with charcoal text. Never olive or dark green. No blue-tinted surfaces. Olive #536600 is only for focus rings. Red only for destructive actions.
Give secondary actions a quieter neutral treatment. Focus indicators must remain
distinguishable against their adjacent surfaces; a bright lime edge alone is
insufficient on white.

## Typography
Use DM Sans as the primary family for navigation, controls, headings, metadata,
and writing. Its approachable character should carry through practical interface
text as well as larger labels.
Establish hierarchy through role, size, weight, spacing, and grouping. Keep page
headings subordinate to the actual creative task in working views.
Present short social posts as writing rather than as articles with mandatory
display headlines. An internal draft name is organisational metadata and is
separate from the content that will be shared.

## Layout
Make capturing an incomplete thought a direct action that does not require a
title, platform, or AI request before the thought can be saved.
Give returning work a clear continuation path with enough excerpt and context
to recognise it.
In the desktop Studio, place the current working draft on the left and optional
AI discussion on the right. Keep the draft visually primary. The working version
may combine the creator's writing and explicitly accepted suggestions.
Keep platform controls and other administration secondary to writing. Make the
original idea accessible through compact source context rather than repeatedly
placing a large source panel above the editor.
Keep conversation messages, proposed revisions, and saved content
distinguishable. A suggestion enters the working draft through an explicit
creator action.
Accommodate short posts, longer platform-specific drafts, and threads without
imposing an article structure on every item. Preserve the relationships between
an original idea and its independently editable platform versions.
Preserve usable writing space as the viewport narrows and keep assistance
accessible without squeezing the draft into an impractical column.

## Elevation & Depth
Use layered surfaces as the default: a quiet neutral canvas with clear white
working areas and fine boundaries where separation is needed.
Keep supporting lists and browsing rows flat, using spacing and dividers to
establish grouping.
Reserve shadows for temporary overlays such as menus, popovers, and dialogs.
Surface separation should identify the active work rather than turn every
section into an elevated card.

## Do's and Don'ts
### Do
- Preserve access to the source idea after developing a draft.
- Keep capture, manual editing, saving, and content management usable without AI.
- Make save progress, successful saving, and failures understandable and actionable.
- Let the creator inspect and edit the context used to personalise assistance.
- Keep publication planning distinct from a record of actual publication.
### Don't
- Invent personal experiences or present unapproved AI opinions as the creator's own.
- Apply long-term Brand Brain changes without creator approval.
- Silently replace unrelated writing when applying a targeted revision.
- Require every idea or draft to complete a mandatory linear publishing workflow.
- Represent an internal planned date as proof that a social platform scheduled
  or published the content.