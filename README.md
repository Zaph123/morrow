# Morrow

**Make something of today.**

Morrow is a personal-first, AI-assisted content workspace that helps creators turn real thoughts, experiences, and ideas into meaningful, platform-specific content—while preserving their voice and ownership.

## Why Morrow exists

People often have ideas worth sharing but struggle to capture them, develop them, write consistently, or keep a sustainable creative workflow. Those activities usually live across chats, notes, documents, calendars, and social platforms. Generic AI writing tools can make the problem worse by producing text that sounds disconnected from the creator’s actual experience.

Morrow brings capture, development, drafting, organization, and planning together in one workspace. It does not claim to have solved this for users yet; the product is still early.

## Why the name Morrow

The name draws inspiration from “the morrow”—tomorrow, the day that follows today. It represents possibility, progress, continuity, and making something meaningful from what we already have.

We believe every idea carries the possibility of becoming something more. Morrow helps people capture their thoughts, discover the stories within their experiences, develop their ideas, and express themselves in their own voices. The name evokes tomorrow, but the product is not about postponing creativity—it is about making something of today so that tomorrow has something to build on.

## Vision and principles

**Core idea:** Every idea carries the possibility of becoming something more.

**Brand philosophy:**

1. **Possibility** — Rough thoughts can become meaningful work. You do not need everything figured out before beginning.
2. **Continuity** — Creativity is capturing, developing, and sharing ideas over time—not only producing isolated posts.
3. **Ownership** — The creator’s ideas, experiences, perspective, and voice stay central. AI supports the process; it does not replace the person creating.

AI should amplify the creator’s thinking and voice, not replace them. AI is an enabling technology, not the product’s entire identity.

**Product principle:** The interface organizes the work; the AI helps move it forward.

## What Morrow does

Planned capabilities for the initial version:

- Quick idea capture
- AI-assisted brainstorming and drafting (AI Studio)
- Platform-specific content adaptation (initially X, LinkedIn, WhatsApp Status)
- Searchable content library and editing
- Creator-controlled Brand Brain and personalization
- Internal scheduling and a manual publishing workflow
- Lightweight performance tracking and feedback
- Reliable saving and data export

Morrow is not merely a chatbot, a generic AI writer, a social scheduling dashboard, or an autonomous publishing agent. The creator stays in control of important changes; personal experiences and opinions must not be invented by AI.

Local manual capture, editing, and saving exist. These are browser-only workflows, not a completed or shipped designed core. Supabase integration, authentication, and AI generation are not implemented.

## Initial scope

**Current designed-core target** (see [current scope](docs/handoff/2026-11-24/current/FIRST-BUILD-SCOPE.txt))

- Personal workspace
- Idea management
- Studio
- Library and editing
- Brand Brain
- You/Profile/Account
- Supabase email/password and Google authentication
- Reliable saving and failure recovery

Calendar and publication recording follow later. Existing publication history must survive; deferral does not authorize deleting stored statuses. The broader PRD remains planning context, not a claim that every capability is in the current phase.

**Out of scope initially**

- Autonomous background agents
- Automatic external publishing
- Team collaboration
- Billing and subscriptions
- Advanced analytics and predictions
- Multi-provider orchestration
- Custom model training

## Technology stack

### Verified in this repository

| Layer | Status |
| ----- | ------ |
| Next.js 16.4 (App Router) | Installed |
| React 19.3 | Installed |
| TypeScript 5.9 | Installed |
| Tailwind CSS v4 | Configured |
| shadcn/ui (Base UI primitives) | Partially configured (Button + theme tokens) |
| pnpm | Package manager |

### Proposed (documented, not configured)

| Layer | Status |
| ----- | ------ |
| Phosphor Icons | Planned (repo currently uses Lucide via shadcn defaults) |
| Supabase (PostgreSQL + Auth) | Existing project reported in the handoff; SDK integration and live configuration unverified |
| AI provider | Unresolved; no provider-specific integration |
| React Hook Form + Zod | Planned — not installed |

## Project status

- Git repository initialized (`morrow`); Create Next App baseline present.
- Product planning documents exist under `docs/`.
- Workspace shell (Home, Ideas, Content, Studio, Calendar, Brand Brain, Settings) is in place.
- **Local workflows:** Home, Ideas, the Content list, and Studio use `morrow:ideas` / `morrow:content`; `/content/new` and `/content/[id]` use the separate `morrow.workspace.v1` snapshot. Both formats are active. They are not unified, and work saved in one is not automatically visible in the other. No migration occurs on render.
- Phase 1 protects local writes, error/retry states, and truthful save feedback while preserving both formats. Local data remains browser-only and can be lost if browser storage is cleared.
- Authentication, cloud database, AI Studio generation, Calendar, Brand Brain, and publishing are not implemented.
- No production deployment or user metrics exist for this project.

## Documentation map

| Document | Path |
| -------- | ---- |
| Product Brief | [`docs/morrow-project-brief.md`](docs/morrow-project-brief.md) |
| Product Requirements (PRD) | [`docs/morrow-PRD.md`](docs/morrow-PRD.md) |
| Technical Architecture | [`docs/morrow_Technical_Architecture_&_Implementation Blueprint.md`](docs/morrow_Technical_Architecture_&_Implementation%20Blueprint.md) |
| UX/UI Design Specification | [`docs/morrow-UXUI_Design_Specification.md`](docs/morrow-UXUI_Design_Specification.md) |
| Project / agent instructions | [`AGENTS.md`](AGENTS.md) |

Authoritative sources: Brief (vision & positioning), PRD (requirements), Architecture (system design), UX/UI (interface & design direction).

Current visual authority is [DESIGN.md](DESIGN.md): light neutral surfaces, lime actions, and DM Sans. Earlier conflicting visual proposals are historical. Phase 2 applies the approved local DM Sans, light tokens, shared navigation, and Home composition; other feature screens retain their existing compositions. The saved theme preference is retained while this build uses Light. shadcn/Base UI remains the baseline with selective reviewed Arc use. The current [collaboration agreement](docs/handoff/2026-11-24/current/CODEX-COLLABORATION.txt) requires approval at phase boundaries.

## Development and setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The root [.env.sample](.env.sample) records the proposed Supabase integration contract. Copy it to `.env.local` only if that file does not already exist; otherwise merge missing names without replacing existing values. Next.js does not load `.env.sample` automatically. Current application code has no Supabase SDK or environment consumers.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SITE_URL` (proposed server-side app-origin convention; does not configure Supabase redirects)

Do not commit secrets. `.env.local` and other private environment files remain ignored; only the root `.env.sample` is excepted. Normal user-scoped auth/data access does not require a secret/service-role key. Google credentials belong in the existing project's provider settings. AI configuration remains unresolved. No live configuration was changed in Phase 1.

Run local regression checks with `node --test scripts/test-*.mjs`, typecheck with `pnpm exec tsc --noEmit`, lint with `pnpm lint`, and build with `pnpm build`. On PowerShell systems that block package-manager scripts, use `pnpm.cmd`. See the [Phase 2 work report](docs/handoff/2026-11-24/PHASE-2-REPORT.md) for actual results and remaining limitations.

Before writing Next.js code, read the version-specific guides under `node_modules/next/dist/docs/` (see `AGENTS.md`).

Browser verification uses the installed Microsoft Edge through Playwright's `msedge` channel, isolated contexts, and synthetic fixtures. No browser download is needed. Run `pnpm exec playwright test` for the synthetic preflight. After `pnpm build`, set `MORROW_BROWSER_APP=1` and run the same command for Phase 2 checks. Screenshots, protocol evidence and machine-readable results are under `artifacts/phase-2/`.
