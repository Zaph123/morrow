Morrow
======

Technical Architecture & Implementation Blueprint
-------------------------------------------------

**Version:** 1.1**Date:** October 17, 2026**Status:** Proposed architecture**Architecture style:** Full-stack application with modular boundaries**Initial deployment:** Personal use**Budget constraint:** Zero planned infrastructure and AI API expenditure

1\. Architectural Overview
==========================

**Morrow** will be a full-stack web application: a personal-first, AI-assisted content workspace and content command centre.

The frontend, application logic, database, and AI integration will have clear responsibilities, but we will avoid introducing separate backend services unless they solve a demonstrated problem.

The architecture consists of five primary layers:

1.  **User interface:** Dashboard, AI Studio, ideas, content library, calendar, and Brand Brain.
    
2.  **Application layer:** Content workflows, validation, scheduling rules, and business logic.
    
3.  **AI integration layer:** Provider-independent interface for generation, revision, and structured suggestions.
    
4.  **Persistence layer:** Database access, authentication, saving, version history, and export.
    
5.  **External services:** Database hosting, AI inference, and application hosting.
    

Core architecture principle
---------------------------

The application must remain useful without AI.

The database, content management features, and ordinary application workflows must not depend on an AI provider being available.

AI is an enhancement to the content workflow, not its foundation. That supports Morrow's Ownership principle: the creator's work must not vanish or become unusable when a provider is offline.

How the architecture supports Morrow's philosophy
-------------------------------------------------

*   Preserve original ideas separately from AI-generated suggestions.
    
*   Keep approved Brand Brain entries distinguishable from suggestions.
    
*   Store content independently of AI conversations.
    
*   Maintain user control over persisted changes (including Brand Brain updates).
    
*   Avoid unnecessary AI requests and preserve manual workflows.
    
*   Keep provider integration replaceable so the product is not locked to one AI service.
    

These are design constraints for implementation. Proposed integrations (Supabase, a specific AI provider, hosting plans) remain subject to validation and are not claimed as already configured in the repository.

2\. Recommended Technology Stack
================================

LayerTechnologyReasonFrameworkNext.js 16 App RouterFull-stack React application with routing and server-side functionalityUIReact 19Component-based interfaceLanguageTypeScriptSafer application logic and explicit data contractsStylingTailwind CSS v4Consistent styling with minimal custom infrastructureComponentsshadcn/ui with Base UI where appropriateAccessible, customizable interface componentsIconsPhosphor IconsConsistent icon systemFormsReact Hook Form and ZodForm state and input validationDatabaseSupabase PostgreSQLRelational data and structured contentAuthenticationSupabase AuthManaged authentication and sessionsDatabase authorizationPostgreSQL Row Level SecurityEnforce data ownership at the database levelAI providerGroq initially, subject to feasibility testingCandidate for free-tier text generationApplication hostingVercel Hobby for eligible personal useConvenient Next.js deploymentVersion controlGit and GitHubSource control and change historyPackage managerpnpmReproducible dependency management

The stack is intentionally familiar to a React/Next.js developer.

We do not need a separate Express server, a microservices architecture, a message queue, or a dedicated vector database for the first version.

### Important hosting constraint

The proposed free hosting options have usage limits and eligibility conditions.

Vercel's Hobby plan is intended for personal, non-commercial use. Supabase's free plan also has resource limits and may pause inactive projects.

We must verify that the intended deployment remains eligible and that its current limits are sufficient. A free development environment is not a guarantee of permanently free production hosting.

3\. Application Structure
=========================

The application will use the Next.js App Router.

A proposed route structure:

*   / — Home and daily briefing
    
*   /studio — AI Studio
    
*   /studio/\[conversationId\] — Existing conversation
    
*   /ideas — Idea Bank
    
*   /ideas/\[ideaId\] — Idea details
    
*   /content — Content Library
    
*   /content/\[contentId\] — Content editor
    
*   /calendar — Content planning
    
*   /brand-brain — Brand Brain
    
*   /settings — Application preferences and data management
    
*   /login — Authentication
    

Routes may be adjusted as the UX specification develops.

Proposed source structure
-------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/  ├── app/  │   ├── (auth)/  │   │   └── login/  │   ├── (workspace)/  │   │   ├── page.tsx  │   │   ├── studio/  │   │   ├── ideas/  │   │   ├── content/  │   │   ├── calendar/  │   │   ├── brand-brain/  │   │   └── settings/  │   ├── api/  │   │   └── ai/  │   ├── layout.tsx  │   └── globals.css  │  ├── components/  │   ├── ui/  │   ├── layout/  │   ├── dashboard/  │   ├── studio/  │   ├── ideas/  │   ├── content/  │   ├── calendar/  │   └── brand-brain/  │  ├── features/  │   ├── ideas/  │   ├── content/  │   ├── conversations/  │   ├── brand-brain/  │   ├── scheduling/  │   └── performance/  │  ├── lib/  │   ├── ai/  │   │   ├── providers/  │   │   ├── prompts/  │   │   ├── context/  │   │   └── schemas/  │   ├── supabase/  │   ├── validation/  │   ├── export/  │   └── utils/  │  └── types/   `

This is a starting structure, not a requirement to create every directory immediately.

We should create modules as their functionality becomes necessary.

Architectural boundaries
------------------------

*   Components handle presentation and user interaction.
    
*   Feature modules own domain-specific logic.
    
*   Server-side application functions coordinate operations.
    
*   Database access remains behind clear data-access boundaries.
    
*   AI provider implementations remain isolated from content-management logic.
    

This should make the codebase easier to maintain without introducing unnecessary abstraction.

4\. Database Architecture
=========================

Supabase PostgreSQL will be the proposed persistence layer.

A relational database suits this product because ideas, content versions, conversations, publication plans, and feedback have meaningful relationships.

Proposed entities
-----------------

### 4.1 Profiles

Stores the user's application profile and preferences.

Possible fields:

*   id
    
*   display\_name
    
*   preferences
    
*   created\_at
    
*   updated\_at
    

The profile identifier should correspond to the authenticated user's identity.

### 4.2 Workspaces

Establishes a boundary for creator-specific data.

Possible fields:

*   id
    
*   name
    
*   owner\_id
    
*   created\_at
    

The initial product needs only one personal workspace.

The schema should support separate workspaces later without implementing team collaboration now.

### 4.3 Ideas

Stores original thoughts and idea-development metadata.

Possible fields:

*   id
    
*   workspace\_id
    
*   title
    
*   original\_text
    
*   notes
    
*   status
    
*   created\_at
    
*   updated\_at
    
*   archived\_at
    

An idea must be saveable without contacting the AI provider.

The original thought should remain distinguishable from AI-generated expansions.

### 4.4 Content Items

Stores drafts and published content.

Possible fields:

*   id
    
*   workspace\_id
    
*   source\_idea\_id
    
*   parent\_content\_id
    
*   title
    
*   body
    
*   platform
    
*   status
    
*   planned\_publish\_at
    
*   published\_at
    
*   created\_at
    
*   updated\_at
    

source\_idea\_id connects content to its originating idea.

parent\_content\_id can connect related platform-specific versions.

A LinkedIn adaptation must remain independently editable from its original X post.

### 4.5 Content Versions

Stores recoverable snapshots of content.

Possible fields:

*   id
    
*   content\_id
    
*   version\_number
    
*   title\_snapshot
    
*   body\_snapshot
    
*   status\_snapshot
    
*   created\_at
    

Versions should be immutable once created.

We should avoid creating a permanent version for every keystroke. Instead, use a deliberate snapshot policy, such as saving checkpoints after meaningful changes or before potentially destructive edits.

### 4.6 Brand Brain Entries

Stores structured personalization information.

Possible fields:

*   id
    
*   workspace\_id
    
*   category
    
*   title
    
*   content
    
*   source\_type
    
*   approval\_status
    
*   created\_at
    
*   updated\_at
    

Categories include Identity, Voice, Content Strategy, and Learning & Feedback.

Potential sources include user-written information, saved examples, and AI-proposed suggestions.

Unapproved suggestions must not be treated as established preferences.

### 4.7 Conversations and Messages

Conversations group AI-assisted work.

A conversation stores:

*   id
    
*   workspace\_id
    
*   title
    
*   created\_at
    
*   updated\_at
    

A message stores:

*   id
    
*   conversation\_id
    
*   role
    
*   content
    
*   created\_at
    

Saved content must remain separate from conversational messages.

The exact conversation-retention policy will be finalized before implementation.

### 4.8 Schedule Entries

Stores internal publishing plans.

Possible fields:

*   id
    
*   workspace\_id
    
*   content\_id
    
*   planned\_at
    
*   status
    
*   created\_at
    
*   updated\_at
    

An internal schedule entry does not mean that content has been scheduled on the external platform.

### 4.9 Feedback and Performance Records

Feedback records store the creator's reactions to AI-generated content and proposed preference changes.

Performance records store manually entered metrics associated with content, platform, and measurement date.

These are secondary to the essential content workflow and can be implemented later.

Data integrity
--------------

We should establish:

*   Foreign-key constraints for relationships.
    
*   Appropriate uniqueness constraints.
    
*   Indexes for frequently used filters and searches.
    
*   Consistent timestamps.
    
*   Explicit deletion and archival behavior.
    
*   Transactional handling for operations that update related records.
    

We should avoid adding tables solely because they appeared in an early conceptual diagram. The final schema should reflect the actual workflows.

5\. Authentication and Authorization
====================================

Authentication will use Supabase Auth.

Even though the first version is personal-first, private ideas and unfinished writing should not be publicly accessible.

Security requirements
---------------------

1.  Authenticate users before exposing private workspace data.
    
2.  Associate every private record with a workspace.
    
3.  Enforce ownership through PostgreSQL Row Level Security.
    
4.  Apply server-side authorization to protected operations.
    
5.  Validate all input received from the browser.
    
6.  Never rely exclusively on client-side checks for authorization.
    
7.  Keep service-role credentials out of browser code.
    

The authenticated user's identity must be verified server-side.

Row Level Security policies must cover every relevant table, including related records such as messages and content versions.

The initial application should not expose a public endpoint that allows anonymous users to read or modify private content.

6\. AI Integration Architecture
===============================

The AI layer is one of the most important parts of the design.

We must be able to change providers without rewriting the AI Studio, Brand Brain, or content-management features.

6.1 Provider-independent interface
----------------------------------

The application should call an internal AI interface rather than directly invoking a specific provider throughout the codebase.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   interface AIProvider {    generateText(input: GenerationInput): Promise;  }   `

This is illustrative; the final types and method signatures will be defined during implementation.

The application communicates with the interface.

A provider adapter handles:

*   Authentication with the provider.
    
*   Request formatting.
    
*   Model selection.
    
*   Response normalization.
    
*   Error classification.
    
*   Usage information where available.
    

The first implementation will use one provider adapter.

We will not build automatic provider switching until there is evidence that it is needed.

6.2 Initial AI workflows
------------------------

The AI layer should support a small number of meaningful tasks:

1.  Brainstorming.
    
2.  Draft generation.
    
3.  Targeted rewriting.
    
4.  Platform adaptation.
    
5.  Alternative generation.
    
6.  Idea development.
    
7.  Suggested Brand Brain updates.
    
8.  Relevant topic exploration when requested.
    

These tasks may share the same provider while using different instructions and output schemas.

We should avoid creating a complicated collection of specialized agents.

6.3 Structured output
---------------------

Where the application expects a specific data shape, validate the response before using it.

For example, three content alternatives should contain the expected fields and should be presented as editable drafts.

Malformed responses must not corrupt saved content.

If structured generation fails, the application should show an understandable error and allow a retry or manual continuation.

6.4 Context construction
------------------------

Each AI request should receive only the context necessary for the task.

Potential context sources:

*   The current user request.
    
*   The active draft or idea.
    
*   Relevant Brand Brain entries.
    
*   A small selection of useful writing examples.
    
*   Relevant conversation history.
    
*   Related published content when repetition checking is requested.
    

We should not automatically send the entire content library or every past conversation with each request.

Context selection should be deliberate and measurable.

6.5 AI usage controls
---------------------

The application should:

*   Avoid duplicate requests caused by repeated clicks.
    
*   Limit request size.
    
*   Apply reasonable timeouts.
    
*   Handle rate limits.
    
*   Prevent unintended parallel generations.
    
*   Avoid calling AI for ordinary database operations.
    
*   Avoid logging private prompt content unnecessarily.
    

When a provider is unavailable, the user should be able to continue editing and saving content.

7\. Data Saving and Recovery
============================

Automatic saving must be reliable, not merely frequent.

Saving behavior
---------------

The editor should indicate whether changes are:

*   Being saved.
    
*   Saved successfully.
    
*   Not yet saved.
    
*   Unable to save.
    

A failed save must not be presented as a successful one.

Preventing stale writes
-----------------------

If several save requests are in flight, an older request must not overwrite a newer version.

We should use an explicit concurrency strategy, such as version checks or an equivalent optimistic-concurrency mechanism.

Recovery
--------

Content version history should provide a practical way to restore an earlier snapshot.

Restoration must be treated as a new change rather than silently destroying the version being replaced.

Export
------

The export system should support portable representations of:

*   Ideas.
    
*   Content items and platform relationships.
    
*   Brand Brain entries.
    
*   Relevant metadata.
    

JSON is suitable for a complete structured export.

Markdown is suitable for readable content and selected Brand Brain material.

The export format should be documented so it remains usable outside this application.

8\. Scheduling Architecture
===========================

Scheduling recommendations should begin with ordinary application logic.

The system can evaluate:

*   Planned publication dates.
    
*   Available drafts.
    
*   Content status.
    
*   Platform.
    
*   Recent topic coverage.
    
*   Intended posting frequency.
    

It can then recommend which drafts might fit upcoming gaps.

AI can optionally explain or refine a recommendation, but scheduling itself should not require AI.

This gives us a useful feature that remains operational when the AI quota is exhausted.

The MVP will not publish automatically or claim that an external platform has scheduled a post.

9\. Deployment and Environment Configuration
============================================

The proposed deployment is Next.js on Vercel, with Supabase providing authentication and PostgreSQL.

This is a straightforward arrangement for a solo developer.

Environment variables
---------------------

The exact names will be finalized during setup, but the configuration will need equivalents of:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   NEXT_PUBLIC_SUPABASE_URL=  NEXT_PUBLIC_SUPABASE_ANON_KEY=  SUPABASE_SERVICE_ROLE_KEY=  GROQ_API_KEY=   `

These are placeholders, not real credentials.

Public Supabase configuration may be exposed to the browser when used correctly with Row Level Security. The service-role key and AI provider key must remain server-side.

We must not commit real secrets to Git.

Local development should use a separate environment file that is excluded from version control.

Production secrets should be configured through the hosting platform's environment-variable settings.

10\. Testing Strategy
=====================

Testing should focus on data integrity, security, and the essential user journey.

Unit tests
----------

Test:

*   Content status transitions.
    
*   Scheduling recommendation rules.
    
*   Input validation.
    
*   AI response normalization.
    
*   Context selection.
    
*   Export serialization.
    

Integration tests
-----------------

Test:

*   Authenticated database access.
    
*   Workspace ownership.
    
*   Content creation and updates.
    
*   Version creation and restoration.
    
*   AI error handling.
    
*   Export behavior.
    

End-to-end tests
----------------

Test the complete workflow:

1.  Capture an idea.
    
2.  Create a draft.
    
3.  Generate or manually write content.
    
4.  Adapt the content for another platform.
    
5.  Save and retrieve both versions.
    
6.  Plan publication.
    
7.  Record manual publication.
    
8.  Recover an earlier version.
    
9.  Export the data.
    
10.  Continue working when AI is unavailable.
    

Security tests must verify that one workspace cannot access another workspace's private data.

11\. Implementation Order
=========================

The implementation should proceed in small, testable increments.

Stage 1: Foundation
-------------------

*   Create the application.
    
*   Configure TypeScript and UI foundations.
    
*   Set up Supabase.
    
*   Implement authentication and access controls.
    
*   Establish the initial database schema.
    
*   Build the application shell.
    

Stage 2: Core content workflow
------------------------------

*   Idea capture.
    
*   Content creation and editing.
    
*   Basic search and filtering.
    
*   Source-idea relationships.
    
*   Automatic saving.
    
*   Manual publishing records.
    

At the end of this stage, the product should already be useful without AI.

Stage 3: AI Studio
------------------

*   Verify the selected provider's free-tier access.
    
*   Implement the provider adapter.
    
*   Add server-side AI request handling.
    
*   Implement drafting and revision.
    
*   Integrate relevant Brand Brain context.
    
*   Handle errors and quota exhaustion.
    

Stage 4: Content operations
---------------------------

*   Daily briefing.
    
*   Calendar.
    
*   Scheduling recommendations.
    
*   Platform-specific versions.
    
*   Approval workflow.
    

Stage 5: Protection and learning
--------------------------------

*   Version history.
    
*   Export and backup.
    
*   Saved writing examples.
    
*   Approved preference learning.
    
*   Lightweight performance tracking.
    

The sequence can change when dependencies require it, but we should avoid implementing secondary features before the core workflow is reliable.

12\. Architectural Decisions
============================

The following decisions are proposed for the MVP:

1.  Use a modular full-stack Next.js application.
    
2.  Use Supabase for authentication and PostgreSQL.
    
3.  Enforce data ownership at the database level.
    
4.  Keep AI integration behind a provider-independent interface.
    
5.  Start with one AI provider.
    
6.  Keep all essential content-management operations independent of AI.
    
7.  Use rule-based scheduling recommendations initially.
    
8.  Implement manual publishing before external integrations.
    
9.  Treat the Brand Brain as structured, user-controlled data.
    
10.  Keep saved content separate from conversation history.
    
11.  Implement reliable automatic saving before sophisticated version history.
    
12.  Support portable data export.
    
13.  Avoid microservices, custom model training, and unnecessary infrastructure.
    
14.  Validate free-tier limits and hosting eligibility before relying on them.
    

Final architectural principle
-----------------------------

Build the smallest reliable system that supports the complete content workflow.

Add complexity only when actual usage demonstrates that it is necessary.