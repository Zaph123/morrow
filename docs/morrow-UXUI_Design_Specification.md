Morrow
======

UX/UI Design Specification
--------------------------

**Version:** 1.1**Date:** October 17, 2026**Status:** Proposed design direction**Design philosophy:** Quietly powerful, creator-focused, AI-assisted**Brand line:** Make something of today.

1\. Design Vision
=================

**Morrow** should feel like a thoughtfully designed personal creative workspace for someone who takes creating content seriously—and who wants a sustainable content practice, not a tool that creates on their behalf.

It should combine the clarity of a productivity application with the flexibility of a creative environment.

The interface should make it easy to answer three questions:

1.  What needs my attention?
    
2.  What can I create or improve right now?
    
3.  Where is my content, and what happens next?
    

The application should not feel like an AI chatbot surrounded by unnecessary dashboards, nor should it resemble a crowded analytics platform. Language and empty states should reflect Possibility, Continuity, and Ownership without heavy motivational marketing.

**Design principle: The interface organizes the work; the AI helps move it forward.**

Desired qualities
-----------------

*   Calm and focused.
    
*   Modern without chasing visual trends.
    
*   Information-rich without feeling crowded.
    
*   Conversational where appropriate.
    
*   Structured where organization matters.
    
*   Responsive across desktop, tablet, and mobile.
    
*   Accessible and keyboard-friendly.
    

2\. Visual Direction
====================

Recommended direction: Editorial Workspace
------------------------------------------

The visual language should combine an editorial writing environment with a modern productivity workspace.

The interface should emphasize typography, spacing, hierarchy, and carefully chosen interactions rather than decorative effects.

### Color direction

A proposed starting palette:

PurposeColorPrimary background#0B0B0CElevated surface#141416Secondary surface#1C1C1FPrimary text#F4F4F5Secondary text#A1A1AABorders#303035Primary accent#A3E635Accent hover#BEF264SuccessAccessible greenWarningAccessible amberErrorAccessible red

These colors are a starting point, not a final commitment.

The accent should be used selectively for important actions, active states, and meaningful highlights. It should not dominate the entire interface.

The application should also support a light theme if doing so fits the implementation scope.

### Typography

Recommended hierarchy:

*   **Headings:** Space Grotesk or a comparable display sans-serif.
    
*   **Body:** Inter or a similar readable sans-serif.
    
*   **Metadata:** The same body family at a smaller size.
    
*   **Content editor:** A comfortable reading width and generous line height.
    

Monospace typography should be reserved for occasional technical details, shortcuts, or metadata where it genuinely helps.

This is a writing and productivity application, not a terminal.

### Surfaces and effects

Prefer:

*   Subtle borders.
    
*   Clear separation between surfaces.
    
*   Consistent spacing.
    
*   Restrained shadows.
    
*   Small, purposeful transitions.
    
*   Distinct hover and focus states.
    

Avoid:

*   Excessive glassmorphism.
    
*   Large decorative gradients.
    
*   Glowing neon borders.
    
*   Animated background effects.
    
*   Cards for every individual element.
    
*   Motion that delays ordinary work.
    

3\. Application Navigation
==========================

The main application should use a persistent navigation structure.

Desktop layout
--------------

The proposed desktop layout has three major areas:

1.  **Sidebar:** Primary navigation and workspace identity.
    
2.  **Main workspace:** The current screen or task.
    
3.  **Contextual panel:** Optional supporting information when it helps the current task.
    

The contextual panel should not be permanently visible everywhere. The available space should serve the active task.

### Primary navigation

DestinationPurposeHomeDaily briefing and next actionsAI StudioBrainstorming, drafting, and refinementIdeasQuick capture and idea developmentContentDrafts, approved posts, and published contentCalendarContent planning and schedulingBrand BrainIdentity, voice, strategy, and learning

Settings and account controls can live near the bottom of the sidebar.

### Sidebar behavior

*   Show a clear active destination.
    
*   Use recognizable icons and concise labels.
    
*   Support a compact mode on smaller desktop screens.
    
*   Avoid nested navigation unless it becomes necessary.
    
*   Preserve navigation consistency across the application.
    

The user should always know where they are and how to return to their content.

4\. Screen One: Home
====================

Purpose
-------

Home should help the user decide what to do next without requiring them to inspect every section.

It is an action-oriented briefing, not an analytics dashboard.

Proposed layout
---------------

### A. Greeting and current context

A concise heading, such as:

"Today in Morrow"

or a calm workflow-oriented alternative such as:

"Your content workspace"

Supporting text can reflect the current day or the user's current workflow. The preferred brand line—"Make something of today."—may appear sparingly in onboarding or empty states, not as constant chrome.

Avoid excessive motivational copy or generic AI-generated greetings.

### B. Recommended next action

Highlight one useful action based on the current state of the workspace.

Examples:

*   Finish a draft awaiting review.
    
*   Develop an idea that has potential.
    
*   Prepare content for an upcoming publishing date.
    
*   Capture a new observation because there is little ready-to-publish content.
    

The recommendation should have a clear explanation and a direct action.

### C. Attention items

Display a small list of relevant items:

*   Drafts needing review.
    
*   Upcoming planned posts.
    
*   Unfinished work.
    
*   Items requiring attention after a failed save or other error.
    

Do not manufacture urgency when nothing needs attention.

### D. Recent ideas

Show recently captured thoughts with quick actions to open or develop them.

### E. Upcoming content

Show the next few planned posts, their platforms, and their current status.

### F. Inspiration

Optionally surface a relevant external topic or a question that might prompt the user to share a genuine experience.

External information must be distinguishable from personal observations and AI suggestions.

Empty state
-----------

A new user should see a clear starting point that reinforces that rough thoughts are enough to begin:

*   Capture a first idea.
    
*   Add basic Brand Brain information.
    
*   Open the AI Studio to explore a thought.
    

Optional supporting line (onboarding or first-run only): "Make something of today."

The interface should not display empty charts or invented productivity statistics.

5\. Screen Two: AI Studio
=========================

Purpose
-------

The AI Studio is the main creative workspace.

It should allow the user to move naturally between thinking, discussing, writing, and editing.

Recommended layout
------------------

A desktop layout with three flexible areas:

**Conversation | Editor | Optional Context**

The conversation and editor are the primary elements. The context panel can be opened when needed.

### A. Conversation panel

Responsibilities:

*   Display the conversation.
    
*   Accept user messages.
    
*   Show generation progress.
    
*   Allow follow-up questions.
    
*   Offer contextual actions on useful responses.
    

The conversation should remain readable and focused.

Avoid displaying excessive technical details about prompts, tokens, or internal model behavior.

### B. Editor panel

Responsibilities:

*   Display the active draft.
    
*   Allow direct editing.
    
*   Show the selected platform.
    
*   Indicate save status.
    
*   Provide access to revision and adaptation actions.
    
*   Save the draft independently of the conversation.
    

The editor is where content becomes a usable artifact.

### C. Context panel

When opened, it can show:

*   The source idea.
    
*   Relevant Brand Brain entries.
    
*   Saved writing examples.
    
*   Related published content.
    
*   A brief summary of the context being used.
    

The user should be able to inspect relevant context without navigating away from the draft.

### D. Generation alternatives

When multiple alternatives are requested, display three distinct options.

Each option should allow the user to:

*   Preview the content.
    
*   Compare it with the others.
    
*   Select it for the editor.
    
*   Combine useful elements manually.
    
*   Request a targeted revision.
    

The options should not overwhelm the screen when the user only wants a simple rewrite.

### E. Draft controls

The active draft should support:

*   Save status.
    
*   Platform selection.
    
*   Draft status.
    
*   Source idea.
    
*   Revision actions.
    
*   Copy content.
    
*   Create a related platform version.
    

### F. AI failure state

When the provider is unavailable, the conversation area should explain the problem.

The editor must remain functional.

The user should be able to continue editing and saving without repeatedly encountering blocking dialogs.

Responsive behavior
-------------------

On narrow screens, the conversation and editor should become separate views or tabs rather than being compressed into unusable columns.

Switching between them must preserve the active draft and conversation state.

6\. Screen Three: Ideas
=======================

Purpose
-------

Make capturing and revisiting thoughts effortless.

Primary layout
--------------

The page should include:

*   A prominent quick-capture input.
    
*   Search.
    
*   Optional filters.
    
*   A list or grid of saved ideas.
    
*   A way to inspect related ideas.
    

### Quick capture

The input should accept a thought immediately.

A title should not be mandatory if it can be generated or edited later.

Saving should not require an AI request.

The interface should provide immediate feedback that the idea was saved.

### Idea item

Each item can display:

*   A short preview.
    
*   Capture date.
    
*   Optional category and tags.
    
*   Development status.
    
*   Links to related ideas or resulting content.
    

### Idea detail view

Opening an idea should preserve the original text.

Additional actions can include:

*   Edit.
    
*   Add notes.
    
*   Connect another idea.
    
*   Develop with AI.
    
*   Create a draft.
    
*   Archive.
    

AI suggestions should be visually distinguishable from the original thought.

7\. Screen Four: Content Library
================================

Purpose
-------

Provide a reliable, searchable home for all content.

Primary layout
--------------

The library should support two useful views:

**List view:** Best for scanning, filtering, and managing many drafts.

**Card view:** Useful for visual browsing and reviewing content previews.

List view should be the initial default because the product is primarily text-focused.

### Filters

Allow filtering by:

*   Platform.
    
*   Status.
    
*   Planned publication date.
    
*   Source idea.
    
*   Relevant tags.
    

Search should cover titles and content text where supported.

### Content item

Display:

*   Title or opening excerpt.
    
*   Platform.
    
*   Status.
    
*   Last modified date.
    
*   Planned publication date, if any.
    

Published content should also show its recorded publication date.

### Bulk operations

Bulk actions are not required initially.

We should first make individual editing, searching, filtering, and status changes reliable.

8\. Screen Five: Content Editor
===============================

Purpose
-------

Provide a focused environment for reviewing and editing a saved content item.

The editor should remain consistent with the editor inside the AI Studio.

### Required elements

*   Editable title.
    
*   Main content body.
    
*   Platform selector.
    
*   Status selector.
    
*   Save indicator.
    
*   Source idea relationship.
    
*   Planned publication date.
    
*   Actual publication details when applicable.
    

### Supporting actions

*   Open in AI Studio.
    
*   Create a related platform version.
    
*   Copy content.
    
*   Preview content.
    
*   View version history when implemented.
    
*   Archive the item.
    

The user should be able to edit content without initiating an AI request.

### Saving behavior

Saving feedback must be visible but unobtrusive.

If saving fails, the interface should clearly indicate that the latest changes are not safely stored.

A successful save should never be inferred merely because the user stopped typing.

9\. Screen Six: Calendar
========================

Purpose
-------

Help the user maintain a realistic publishing routine.

Recommended view
----------------

Begin with a simple calendar that displays planned posts and allows users to inspect the upcoming schedule.

A week-oriented view is a useful starting point, with a list of upcoming posts available as an alternative.

### Calendar item

Each item should show:

*   Content title or preview.
    
*   Platform.
    
*   Status.
    
*   Planned date and time.
    

Selecting an item opens its details.

### Scheduling recommendations

The application may suggest placing available drafts into open calendar slots.

Suggestions should account for:

*   Planned frequency.
    
*   Draft readiness.
    
*   Topic variety.
    
*   Effort required.
    
*   Relevant upcoming topics.
    

Recommendations should be optional.

The user must be able to change dates without asking AI.

### Important distinction

The calendar represents the application's internal plan.

It must not imply that a post has been scheduled or published externally.

10\. Screen Seven: Brand Brain
==============================

Purpose
-------

Give the user a clear, editable representation of what the AI knows about their content preferences.

Layout
------

Use four primary sections:

### Identity

Relevant background, interests, goals, and confirmed personal experiences.

### Voice

Tone, writing style, language preferences, formatting, and examples.

### Content Strategy

Topics, content pillars, audience, platform priorities, and objectives.

### Learning & Feedback

Approved preferences, recurring patterns, and suggestions awaiting review.

Interaction model
-----------------

Every entry should have a clear status where relevant.

For example:

*   User-defined.
    
*   Approved.
    
*   Suggested.
    
*   Rejected.
    

Suggested changes should be reviewed before they affect permanent preferences.

The interface should make it easy to inspect, edit, and remove information.

Avoid presenting a mysterious AI-generated personality profile that the user cannot control.

11\. Screen Eight: Settings and Data Management
===============================================

Purpose
-------

Provide access to application preferences, reliability controls, and data ownership features.

### Initial settings

*   Theme preference.
    
*   Default platform.
    
*   Intended publishing frequency.
    
*   Notification or reminder preferences, where supported.
    
*   AI provider status and usage information where available.
    
*   Data export.
    
*   Account and security settings.
    

Version history and recovery controls may also be exposed through the relevant content editor.

### Data export

The user should be able to export their content in a portable format.

Export progress and errors must be clear.

An export must not require AI to be available.

12\. Shared Interaction Patterns
================================

The following patterns should behave consistently throughout the application.

Saving
------

*   Show saving progress.
    
*   Confirm successful persistence.
    
*   Expose failed saves.
    
*   Preserve unsaved text where possible.
    
*   Avoid misleading success indicators.
    

Confirmation
------------

Use confirmation for destructive or difficult-to-reverse actions.

Routine operations should not trigger unnecessary confirmation dialogs.

Notifications
-------------

Use restrained, contextual feedback.

A successful idea capture should not produce an elaborate animation or interrupt the user's workflow.

Loading
-------

Prefer localized loading indicators.

The entire application should not become blocked because one panel is waiting for AI.

Error handling
--------------

Errors should explain:

1.  What happened.
    
2.  Whether the user's work was saved.
    
3.  What the user can do next.
    

Keyboard accessibility
----------------------

Important actions should be accessible through keyboard navigation.

Inputs, buttons, menus, dialogs, and editor controls should have visible focus states.

13\. Motion and Animation
=========================

Motion should clarify state changes rather than serve as decoration.

Appropriate examples:

*   A subtle transition when opening a contextual panel.
    
*   A brief confirmation when an item is saved.
    
*   A smooth transition between workspace views.
    
*   A restrained appearance transition for generation results.
    

Avoid:

*   Long entrance animations.
    
*   Constantly moving interface elements.
    
*   Animated gradients.
    
*   Unnecessary page transitions.
    
*   Motion that delays copying, saving, or editing.
    

Reduced-motion preferences must be respected.

Core actions should remain immediate and usable when animation is disabled.

14\. Responsive Design
======================

Desktop
-------

Use the full workspace layout, with optional contextual panels.

The AI Studio may display conversation and editor side by side when sufficient width is available.

Tablet
------

Reduce navigation width and simplify multi-column layouts.

Context panels should become optional drawers.

Mobile
------

Prioritize:

*   Quick idea capture.
    
*   Reading and editing drafts.
    
*   AI conversation.
    
*   Copying content.
    
*   Viewing upcoming posts.
    
*   Basic status changes.
    

The mobile experience should use clear, focused views rather than squeezing the desktop layout onto a smaller screen.

All primary workflows must remain functional.

15\. Accessibility
==================

The interface should target WCAG 2.2 AA where practical.

Requirements include:

*   Sufficient text contrast.
    
*   Visible keyboard focus.
    
*   Proper semantic structure.
    
*   Accessible form labels.
    
*   Keyboard-operable menus and dialogs.
    
*   Meaningful error messages.
    
*   Reduced-motion support.
    
*   Status indicators that do not rely on color alone.
    

Accessibility should be built into shared components rather than added as a final polish step.

16\. Initial Design System
==========================

The first implementation should establish reusable tokens for:

*   Colors.
    
*   Typography.
    
*   Spacing.
    
*   Border radii.
    
*   Borders and shadows.
    
*   Focus states.
    
*   Motion durations.
    
*   Responsive breakpoints.
    

Shared components should include:

*   Buttons.
    
*   Inputs and text areas.
    
*   Navigation items.
    
*   Status badges.
    
*   Dialogs.
    
*   Dropdowns.
    
*   Toasts.
    
*   Empty states.
    
*   Loading indicators.
    
*   Content previews.
    
*   Save-state indicators.
    

We should use existing accessible components where practical and customize them to match the product.

Avoid building a large component library before the actual screens require it.

17\. Design Validation
======================

Before implementing every screen, validate the three most important experiences.

Experience A: Capture an idea
-----------------------------

Can the user save a raw thought in seconds without completing forms or waiting for AI?

Experience B: Turn an idea into content
---------------------------------------

Can the user move from an original thought to a refined, platform-specific draft while preserving their voice and controlling every change?

Experience C: Manage content without AI
---------------------------------------

Can the user edit, organize, schedule, and manually publish content when the AI provider is unavailable?

These three experiences should guide the first implementation slice.

18\. Final Design Principle
===========================

Morrow should feel like a workspace that respects the creator's attention and ownership of their voice.

The design should help the user think clearly, create confidently, and maintain control over their work—whether AI is available or not.

**The interface should never make the creator feel like they're managing the tool instead of creating content.**