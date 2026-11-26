Morrow
======

Product Requirements Document (PRD)
-----------------------------------

**Version:** 1.1**Date:** October 2026**Status:** Draft — Ready for technical feasibility review**Product stage:** Personal-first MVP

1\. Purpose
-----------

This document defines the functional requirements, user workflows, priorities, and acceptance criteria for the first usable version of **Morrow**.

It translates the Product Brief into a practical implementation plan. Vision and brand positioning live in the Product Brief; this PRD is the source for functional requirements and acceptance criteria.

Morrow is a personal-first, AI-assisted content workspace. The MVP must help one creator capture ideas, develop authentic content, manage publication plans, and improve their writing workflow without depending entirely on AI availability.

**Requirements that follow from brand philosophy (Possibility, Continuity, Ownership):**

*   Preserve the creator's original idea.
    
*   Never invent personal experiences or opinions.
    
*   Distinguish sourced facts from AI suggestions.
    
*   Keep the creator in control of important changes.
    
*   Require approval for permanent Brand Brain updates.
    
*   Keep manual content management functional without AI.
    
*   Make platform adaptation preserve the creator's meaning and voice.
    
*   Never imply that internal scheduling means external publication.

2\. Primary User
----------------

The initial user is a developer and content creator who publishes or intends to publish content about:

*   Frontend development and software engineering.
    
*   Building products and learning in public.
    
*   UI/UX, design, and technology.
    
*   Career development and personal observations.
    
*   Psychology, philosophy, and human behavior.
    
*   Relatable humor about developers and modern life.
    

These topics are initial examples, not mandatory content categories.

The application should accommodate new interests without requiring changes to its underlying architecture.

3\. Core User Journey
---------------------

The primary workflow is:

**Capture → Explore → Create → Refine → Approve → Plan → Publish → Learn**

1.  The user captures an idea or discovers a relevant topic.
    
2.  The idea is stored without requiring an AI request.
    
3.  The user develops it independently or discusses it with the AI.
    
4.  The AI produces content options using available Brand Brain context.
    
5.  The user edits, compares, combines, or rejects the options.
    
6.  The selected content is saved and approved.
    
7.  The user plans publication or publishes manually.
    
8.  The user records publication details and, optionally, performance metrics.
    
9.  Feedback and saved examples inform future content generation.
    

Not every piece of content must follow every step.

4\. Functional Requirements
===========================

Priority definitions:

*   **P0 — Essential:** Required for the MVP to be useful and reliable.
    
*   **P1 — Important:** Included when the essential workflow is stable.
    
*   **P2 — Later:** Deferred until real usage demonstrates a need.
    

4.1 Dashboard and Daily Briefing
--------------------------------

**Priority: P0**

The home screen should summarize the current state of the user's content operation and recommend a useful next action.

### Requirements

*   Display content requiring attention.
    
*   Show upcoming planned posts.
    
*   Identify gaps in the intended posting schedule.
    
*   Surface relevant ideas or opportunities when available.
    
*   Recommend a next step based on schedule, content quality, relevance, effort, and variety.
    
*   Allow the user to navigate directly to the relevant item.
    
*   Provide a way to refresh the briefing.
    

The briefing should use stored information and straightforward rules wherever possible. External research or AI generation should occur only when useful.

### Acceptance criteria

*   The user can identify the most important outstanding content tasks.
    
*   Selecting an item opens the corresponding content or workflow.
    
*   An empty content library produces a useful starting state rather than an empty dashboard.
    
*   The dashboard remains usable when the AI provider is unavailable.
    
*   The briefing does not claim that external research was performed when it was not.
    

4.2 AI Studio
-------------

**Priority: P0**

The AI Studio combines conversation and content editing.

### Requirements

*   Start a new content conversation.
    
*   Continue an existing conversation.
    
*   Brainstorm, draft, rewrite, and refine content.
    
*   Generate three meaningfully different alternatives when alternatives are requested.
    
*   Revise selected text or a complete draft.
    
*   Compare alternatives when helpful.
    
*   Save a chosen result to the Content Library.
    
*   Associate generated content with an original idea where applicable.
    
*   Preserve the distinction between conversational messages and saved content.
    
*   Display clear loading, success, and failure states.
    

### Acceptance criteria

*   The user can create a draft through conversation and save it independently of the conversation.
    
*   Revising a draft does not silently overwrite unrelated content.
    
*   The user can edit AI-generated text manually.
    
*   AI responses do not automatically become permanent Brand Brain memories.
    
*   If an AI request fails, the existing draft remains available.
    
*   The user can continue working manually when AI access is unavailable.
    

4.3 Idea Bank
-------------

**Priority: P0**

The Idea Bank must make capturing thoughts almost effortless.

### Requirements

*   Capture a raw idea through a simple input.
    
*   Preserve the original wording.
    
*   Allow ideas to be edited, searched, archived, and revisited.
    
*   Support optional categories and tags.
    
*   Allow users to connect related ideas.
    
*   Support AI-assisted development when requested.
    
*   Suggest possible content angles without automatically converting every idea into a post.
    

### Acceptance criteria

*   Saving an idea does not require an AI request.
    
*   The user can save an incomplete thought without completing a form.
    
*   The original idea remains accessible after AI-assisted development.
    
*   The user can reject or modify suggested categories and tags.
    
*   Related ideas can be opened from one another.
    

4.4 Brand Brain
---------------

**Priority: P0**

The Brand Brain provides structured context for personalized content generation.

### Required sections

**Identity**

*   Relevant background and experience.
    
*   Interests and goals.
    
*   Topics the creator wants to explore.
    

**Voice**

*   Preferred tone and writing style.
    
*   Formatting and language preferences.
    
*   Examples of writing the creator likes.
    

**Content Strategy**

*   Content pillars.
    
*   Platform priorities.
    
*   Intended audiences and objectives.
    

**Learning & Feedback**

*   Approved writing preferences.
    
*   Recurring patterns identified from feedback.
    
*   References to useful examples.
    

### Requirements

*   Allow the user to create, edit, and remove information.
    
*   Allow examples to be saved and reviewed.
    
*   Allow the AI to suggest updates.
    
*   Require approval before suggested long-term preferences are applied.
    
*   Make the relevant Brand Brain context available to the AI Studio.
    
*   Avoid sending irrelevant or unnecessarily large amounts of context to the AI provider.
    

### Acceptance criteria

*   The user can inspect the information used to personalize generation.
    
*   The user can change a preference without retraining a model.
    
*   A suggested preference does not become permanent without approval.
    
*   The AI does not treat an unverified suggestion as a confirmed personal experience.
    
*   Removing an item prevents it from being included in future context, subject to the application's retention and version-history rules.
    

4.5 Content Library
-------------------

**Priority: P0**

The Content Library is the central record of the user's content.

### Requirements

Each content item should support:

*   Title.
    
*   Body.
    
*   Platform.
    
*   Status.
    
*   Creation and modification timestamps.
    
*   Optional source idea.
    
*   Optional tags.
    
*   Optional planned publication date.
    
*   Optional actual publication date.
    
*   Optional relationship to other platform-specific versions.
    

Supported statuses:

Idea → Draft → Ready for Review → Approved → Scheduled → Published

Archived is also available.

These are flexible statuses, not mandatory transitions.

### Acceptance criteria

*   The user can create, edit, search, filter, archive, and restore content.
    
*   The user can change a status without completing every preceding stage.
    
*   A single idea can have multiple related platform versions.
    
*   Each version can be edited independently.
    
*   Published content can record the platform and actual publication date.
    
*   A planned publication date is never represented as proof of actual publication.
    

4.6 Platform Adaptation
-----------------------

**Priority: P0**

The system should help transform a central idea into content suitable for different platforms.

### Initial platforms

1.  X.
    
2.  LinkedIn.
    
3.  WhatsApp Status.
    

### Requirements

*   Generate platform-specific versions of an idea or draft.
    
*   Preserve the creator's intended meaning.
    
*   Adapt structure, length, tone, and presentation to the destination.
    
*   Allow each version to be edited independently.
    
*   Preserve a link to the original idea or source draft.
    
*   Avoid automatically assuming that every piece of content belongs on every platform.
    

### Acceptance criteria

*   The user can generate a platform-specific version from an existing draft.
    
*   Changes to one version do not silently change other versions.
    
*   The user can compare versions and choose which to keep.
    
*   Platform constraints are checked against current, verified requirements where necessary rather than assumed to remain fixed.
    

4.7 Calendar and Scheduling Recommendations
-------------------------------------------

**Priority: P1**

The calendar helps the user plan a sustainable publishing routine.

### Requirements

*   View planned content by date.
    
*   Assign or change a planned publication date.
    
*   Identify gaps in the intended schedule.
    
*   Suggest where available drafts might fit.
    
*   Consider content quality, relevance, effort, and recent topic variety.
    
*   Allow recommendations to be accepted, rejected, or modified.
    
*   Distinguish internal planning from actual platform scheduling.
    

### Acceptance criteria

*   The user can move a planned post to another date.
    
*   The system can identify an empty planned publishing period.
    
*   Recommendations do not automatically publish content.
    
*   The system does not force weak content into the schedule merely to meet a quota.
    
*   The calendar remains accessible without AI.
    

4.8 Manual Publishing Workflow
------------------------------

**Priority: P0**

The first version will not automatically publish to social platforms.

### Requirements

*   Display the approved content in a publishing-ready view.
    
*   Allow the user to copy content.
    
*   Provide a reminder of the intended platform and publication date.
    
*   Allow the user to mark content as published.
    
*   Record the actual publication date and platform.
    
*   Allow publication details to be corrected.
    

### Acceptance criteria

*   The user can publish content manually without requiring an AI request.
    
*   Marking content as published records the user's action; it does not imply the application verified publication externally.
    
*   The user can correct an inaccurate publication record.
    
*   No content is automatically published without an explicitly implemented and authorized integration.
    

4.9 Feedback and Voice Improvement
----------------------------------

**Priority: P1**

### Requirements

*   Allow direct feedback on AI-generated content.
    
*   Support targeted revision requests.
    
*   Allow the user to save strong examples.
    
*   Allow the AI to identify recurring preferences.
    
*   Present proposed long-term preference changes for approval.
    
*   Use approved preferences and relevant examples in future generations.
    

### Acceptance criteria

*   The user can explain why a draft does not sound right and request a revision.
    
*   A single edit does not automatically become a permanent rule.
    
*   The user can inspect and reject a proposed preference.
    
*   Feedback does not modify unrelated Brand Brain information without approval.
    

4.10 Performance Tracking
-------------------------

**Priority: P1**

Performance tracking should support learning without becoming a large analytics project.

### Requirements

*   Allow manual recording of available metrics, such as views, likes, replies, and reposts.
    
*   Associate metrics with the relevant content, platform, and measurement date.
    
*   Allow previous measurements to remain distinguishable from newer ones.
    
*   Support basic summaries and AI-assisted reflection.
    
*   Separate recorded facts from hypotheses about performance.
    

### Acceptance criteria

*   The user can record and update available metrics.
    
*   Metrics remain associated with the correct content and platform.
    
*   The AI can suggest experiments but does not claim causation without evidence.
    
*   Performance tracking does not require an external analytics integration.
    

4.11 Saving, Version History, and Export
----------------------------------------

**Priority: P0 for reliable saving; P1 for version history and export**

### Requirements

*   Save content changes automatically.
    
*   Display saving, saved, and failed-save states.
    
*   Prevent older asynchronous saves from overwriting newer changes.
    
*   Provide recovery from accidental edits or overwrites.
    
*   Export ideas, content, and Brand Brain information in portable formats.
    
*   Keep user data accessible when the AI service is unavailable.
    

### Acceptance criteria

*   The user receives clear confirmation when changes are saved.
    
*   A failed save is visible and recoverable.
    
*   Reopening an item retrieves its last successfully saved version.
    
*   The user can recover a previous version when version history is implemented.
    
*   Exported files contain the selected content in a documented, portable format.
    
*   Export and backup do not depend on a functioning AI provider.
    

5\. Cross-Cutting Requirements
==============================

5.1 AI Provider Independence
----------------------------

The AI integration must be isolated behind a replaceable application interface.

Application features should not depend directly on one provider's response format or proprietary behavior.

The system must handle:

*   Usage limits.
    
*   Temporary outages.
    
*   Timeouts.
    
*   Invalid responses.
    
*   Network failures.
    
*   Missing or malformed generated content.
    

When AI is unavailable, the application should explain the problem and preserve access to saved work.

A second provider is not required for the MVP.

5.2 Cost Control
----------------

*   Database operations must not require AI.
    
*   Capturing ideas must not require AI.
    
*   Manual editing and publishing must not require AI.
    
*   AI requests should include only relevant context.
    
*   Expensive or repeated requests should be avoided where practical.
    
*   Usage limits and provider policies must be respected.
    

5.3 Privacy and Data Protection
-------------------------------

*   Store only information necessary for the product's functionality.
    
*   Protect private content and account access.
    
*   Verify the chosen AI provider's data handling terms before sending personal context.
    
*   Avoid transmitting unrelated personal information to the AI provider.
    
*   Provide a practical way to export important user data.
    
*   Define deletion and retention behavior for content, conversations, and historical versions.
    

5.4 Reliability
---------------

The core content workflow must remain functional during AI outages.

Saving, searching, editing, organizing, and manually publishing content should not require a successful AI request.

5.5 Usability
-------------

*   Keep the navigation predictable.
    
*   Minimize friction during idea capture.
    
*   Provide clear feedback after important actions.
    
*   Avoid overwhelming the dashboard with statistics and controls.
    
*   Make important actions accessible without navigating through unnecessary screens.
    

6\. Initial Data Model
======================

The following entities are proposed. Their exact fields and relationships will be finalized during architecture design.

EntityPurposeUserRepresents the creator and account preferences.WorkspaceProvides a boundary for creator-specific data and future expansion.IdeaStores raw thoughts and developed ideas.Content ItemStores a draft or published piece of content.Content RelationshipLinks platform versions and source ideas.Content VersionRecords recoverable versions of content.Brand Brain EntryStores structured identity, voice, and strategy information.ConversationGroups an AI-assisted working session.MessageStores conversation messages where retention is enabled.Schedule EntryStores internal publication plans.Performance RecordStores manually recorded metrics.Feedback RecordStores feedback and proposed learning.Saved ExampleReferences content used as a writing example.

This is a conceptual model, not a commitment to create a separate database table for every entity.

The final schema should avoid unnecessary duplication and remain appropriate for a personal-first application.

7\. MVP Release Strategy
========================

Milestone 1 — Reliable Foundation
---------------------------------

*   Application shell and navigation.
    
*   Data persistence.
    
*   Idea capture.
    
*   Content creation and editing.
    
*   Search and basic filtering.
    
*   Initial Brand Brain structure.
    
*   Manual content workflows.
    

**Exit condition:** The user can manage ideas and content reliably without AI.

Milestone 2 — AI-Assisted Creation
----------------------------------

*   AI provider integration.
    
*   Conversational AI Studio.
    
*   Draft generation and revision.
    
*   Platform-specific variations.
    
*   Relevant Brand Brain context.
    
*   Graceful handling of AI failures.
    

**Exit condition:** The user can create and refine content with AI while retaining manual control.

Milestone 3 — Content Operations
--------------------------------

*   Daily briefing.
    
*   Calendar.
    
*   Scheduling recommendations.
    
*   Approval workflow.
    
*   Manual publishing records.
    
*   Basic reminders.
    

**Exit condition:** The user can organize a sustainable content routine in one place.

Milestone 4 — Personalization and Protection
--------------------------------------------

*   Feedback-driven voice improvement.
    
*   Saved examples.
    
*   Version history.
    
*   Export and backup.
    
*   Lightweight performance tracking.
    

**Exit condition:** The product can support continued use, recovery, and learning from previous work.

Milestones may overlap where doing so is safe and practical. They are intended to guide implementation, not force unnecessary separation.

8\. Out of Scope for the MVP
============================

The following are explicitly deferred:

*   Autonomous background agents.
    
*   Automatic social publishing.
    
*   Multiple AI providers operating in automatic failover.
    
*   Local AI inference.
    
*   Custom AI model training.
    
*   Team collaboration.
    
*   Subscription billing.
    
*   Sophisticated predictive analytics.
    
*   Complex adaptive scheduling.
    
*   Extensive third-party integrations.
    
*   A plugin marketplace.
    

These features may be reconsidered after the core workflow has been validated through actual use.

9\. MVP Acceptance Test
=======================

The MVP is ready for personal use when the following end-to-end scenario succeeds:

1.  The user captures an idea without using AI.
    
2.  The idea is saved and can be retrieved.
    
3.  The user develops the idea into a draft.
    
4.  The user requests AI assistance to produce alternative versions.
    
5.  The user refines a selected version and saves it.
    
6.  The user adapts the content for another platform.
    
7.  Both versions remain independently editable and linked to their source.
    
8.  The user approves a version and assigns a planned publication date.
    
9.  The user manually publishes the content and records the actual publication details.
    
10.  The user can retrieve the published record later.
    
11.  The user can recover an earlier version and export their data once those capabilities are implemented.
    
12.  If the AI provider becomes unavailable, saved content remains accessible and the user can continue working manually.
    

**The product must prove that it can manage content reliably before adding more sophisticated automation.**

10\. Immediate Next Step
========================

The Technical Architecture document proposes Next.js, Supabase, and a replaceable AI provider interface. Before depending on AI for creation workflows, validate the highest-risk dependency: **finding an AI provider that is genuinely usable within the zero-budget constraint.**

The feasibility review should establish:

*   Whether an eligible free tier is available.
    
*   Which models and tasks it supports.
    
*   Request and token limits.
    
*   Whether its terms permit the intended use.
    
*   How it handles submitted data.
    
*   Whether the expected writing workflow fits within its limits.
    
*   What the application should do when the free quota is exhausted.
    

Until that review is complete, treat the chosen provider name in the architecture document as a candidate, not a validated integration. Core Morrow workflows (capture, edit, organize, save) must remain implementable without AI.