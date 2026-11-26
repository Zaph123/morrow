# Morrow Design MD Planner Preparation

**Purpose:** Read-only design preparation; no redesign or final `DESIGN.md` was produced.
**Product direction:** Quiet Vitality — an editorial workspace with a warm, restrained, contemporary identity.

## 1. Current-state findings

### Product and implementation

- Morrow is a personal-first content workspace built around Possibility, Continuity, and Ownership. The creator's perspective remains authoritative; AI is assistive and must not invent personal experiences or opinions. Manual capture, writing, editing, and saving should remain useful without AI. Sources: `AGENTS.md`, `docs/morrow-project-brief.md`, `docs/morrow-PRD.md`.
- The repository is a Next.js App Router app using React, TypeScript, Tailwind CSS v4, Base UI, CVA, Lucide, and Motion (`package.json`). The shared button is `components/ui/button.tsx`.
- Routes in `app/(workspace)/`: `/` (Home), `/studio`, `/ideas`, `/ideas/[id]`, `/content`, `/content/new`, `/content/[id]`, `/calendar`, `/brand-brain`, `/settings`, and `/button-comparison`.
- Home reads locally stored ideas and content and provides quick actions. Ideas support capture and editing. Content has a library and a create/edit path. `/studio` is currently a manual draft editor, not a conversational AI workspace. Calendar, Brand Brain, and Settings render explanatory placeholders; they are not finished product experiences.
- Current Studio direction from the product owner: writing environment first, with an optional AI conversation panel. This is a UX decision, not implemented behavior.
- Two persistence/editor paths are present: older pages and `/studio` use `lib/storage.ts` and legacy types; `/content/new` and `/content/[id]` use `lib/workspace/repository.ts`, `lib/workspace/storage.ts`, and `components/content/content-editor.tsx`. `docs/phase-1-local-workspace.md` describes the newer path. This split needs to be accounted for when documenting save behavior and screen responsibilities.

### Design implementation

- `app/globals.css` defines light `:root` tokens and a separate `.dark` palette. `app/layout.tsx` places `dark` on `<html>` unconditionally, so the light tokens exist but the observed app has no theme switch or theme persistence.
- The actual current dark tokens are cool near-black OKLCH surfaces with a bright lime green brand token. They do not match the new warm-neutral candidates. Candidate colors in this report remain provisional and are not accessibility-approved.
- `app/layout.tsx` loads Inter, Space Grotesk, and Geist Mono. Inter is the sans/interface face; Space Grotesk is the heading face. The current project direction asks to evaluate this combination, not presume it stays.
- `components/layout/workspace-shell.tsx` uses a fixed desktop sidebar, a mobile top bar and bottom navigation, and a centered `max-w-3xl` content area. Mobile navigation has a “More” sheet. No finished adaptive three-pane Studio is present.
- Existing UI uses mixed Tailwind spacing and radii. `DESIGN.md` describes a 4px base and a radius ladder, while the CSS uses a base `--radius: 0.625rem` and derived radii; components also use several rounded utility sizes. These are not yet a verified unified scale.
- Ordinary app motion is mostly CSS transitions. Navigation uses `motion-safe` transitions; Arc's Motion-powered button has reduced-motion handling but appears in the comparison route rather than as the shared product button. Do not generalize Arc behavior to all Morrow interactions.
- Some controls use labels, focus rings, `aria-current`, and status/alert roles. The mobile “More” sheet handles Escape and declares a modal dialog, but focus trapping/restoration and overall accessibility have not been audited.
- Base UI is the current shared component foundation. Arc components are experiments/candidates. `components/arc/foundation.css` is not globally imported because its theme setup conflicts with Morrow tokens, as documented by `AGENTS.md` and `docs/uiarc-button-catalog.md`.

### Reference artifacts

- Overtake extraction artifacts are present: `ai-generated.json`, `design-tokens.clean.css`, and `design-system-frames/01-color.png` through `05-ui-patterns.png`. `design-tokens.css` and `source-extraction.json` were not found at the project root. The Overtake material is a marketing-site reference, not Morrow's design system.
- No earlier design-planner preparation report was present in `docs/` when this report was created.

## 2. Confirmed decisions

- **Product:** Morrow. **Tagline:** “Make something of today.”
- Morrow supports creators turning thoughts, experiences, observations, research, and ideas into authentic content.
- The creator owns their ideas, perspective, and voice; AI may support but must not invent personal experiences or opinions.
- The intended workflow is capture → develop → draft → refine → adapt for a platform → review/approve → plan publication → publish manually → learn from results. Not every item must use every step.
- The product should feel like a thoughtful creative workspace, not a generic AI chatbot or statistics-heavy dashboard.
- Core principles: Possibility, Continuity, Ownership. Manual work must remain useful when AI is unavailable.
- Studio is writer-first, with an optional AI conversation panel. The writing remains central and assistance is available on request.
- Current visual hypothesis is **Quiet Vitality**: quiet, creative, sophisticated, warm, restrained, contemporary, minimal without emptiness, and distinct from generic AI SaaS.
- Desired visual principles: warm neutral foundations; purposeful green; deliberately designed light and dark themes; editorial headings, clear UI type, comfortable reading; generous section rhythm with compact controls/lists as needed; focused writing space; refined surfaces; only useful elevation; reduced-motion-aware purposeful transitions; typography-led identity with restrained graphic details.
- The listed colors (`#F7F6F2`, `#FFFFFF`, `#111312`, `#1B1E1B`, `#A3D977`, and considered deeper green `#426B35`) are candidates only, not approved tokens.
- Base UI remains the current component foundation. UIArc is not an approved replacement. Existing implementation and docs must be audited rather than assumed correct.

## 3. Open decisions

- Whether to approve Quiet Vitality as the selected design direction after reviewing the alternatives below.
- Which 2–3 visual references Morrow should be compared against. The planner skill calls this especially valuable, but none were provided in the current brief.
- Whether light and dark themes are both in initial product scope, and their default/selection behavior. “Intentionally designed themes” is confirmed as a design objective; app behavior is not.
- Final typeface pairing and scale. Inter + Space Grotesk are existing choices to evaluate; no replacement or retention has been decided.
- Final semantic palette, contrast-checked foreground/surface pairings, and roles for either green. Values remain proposals until evaluated.
- The final layout widths, responsive breakpoints, density rules, radius hierarchy, border/elevation policy, and motion timings. Avoid deriving these from Overtake or from the present components without evaluation.
- Which content editor/storage path is authoritative, and how the future writer-first Studio relates to the current `/studio` and `/content` flows.

## 4. Documentation conflicts and limitations

- **README status contradiction:** `README.md` says “None of the feature areas above are implemented as product functionality yet,” then its project-status section says the Phase 1 Ideas/Content local workflow is implemented. The implementation does contain local capture/edit/draft flows, though there are two storage paths.
- **Scope versus code:** The brief, PRD, and UX spec describe a much broader product (conversational generation, calendar operations, Brand Brain, publishing, and learning) than the current routes implement. `/calendar`, `/brand-brain`, and `/settings` explicitly render placeholders; `/studio` is manual editing today.
- **Visual direction drift:** Root `DESIGN.md` and the UX spec describe a cool dark palette with vivid lime, Space Grotesk/Inter, and an editorial workspace. Current CSS implements that dark direction and defines a light neutral palette, but forces dark mode. Quiet Vitality proposes warmer neutrals, a more restrained green, and intentional dual themes. This is a deliberate direction change to approve, not a discrepancy to silently normalize.
- **Token/code mismatch:** Root `DESIGN.md` specifies no shadows and a 4px spacing base, but the mobile navigation sheet uses `shadow-lg`; code uses varied spacing and radius utilities. Its component radius guidance (buttons/cards at 6px/8px) also differs from the current derived CSS radii and common rounded utility usage. Audit actual use before codifying.
- **Typography mismatch in scope:** Existing docs specify Space Grotesk for headings and Inter for body, while the new direction calls for editorial headings, contemporary UI type, and reading comfort without naming exact families. Geist Mono is loaded but intended for technical details only in the UX spec.
- **Navigation/layout mismatch:** The UX spec proposes desktop sidebar + workspace + optional contextual panel and compact sidebar behavior; the implementation has a fixed 240px sidebar and one centered content column. Tablet behavior and the intended Studio panel layout remain unspecified.
- **Storage/editor split:** `docs/phase-1-local-workspace.md` describes the newer repository and shared editor, but `/studio`, `/ideas`, and `/content` include older `lib/storage.ts` consumers. `/content/new` and `/content/[id]` use the newer repository/editor. Save states and route relationships should be described from verified flows only.
- **Arc adoption ambiguity:** Some Arc reports recommend selective adoption and describe its motion as a strong fit; `AGENTS.md` and the catalog correctly say it is a candidate and warn against importing its foundation theme. Treat installed components and reports as experiments, not product-wide decisions.
- **Planner skill support files are unavailable:** `C:/Users/PC/.agents/skills/design-md-planner/SKILL.md` is present and was read in full, but its six `references/*.md` files are zero bytes and the `assets` directory has no template/example files. The promised exact Google format/lint rules and supplemental style/type/color guidance cannot be verified here.
- **Planner workflow nuance:** The skill's codify-existing section says to extract and then proceed to the direction implied by the good existing work, while its next step prescribes 3–4 concrete directions. This report follows the explicit request to prepare four options while preserving existing evidence. The skill says to use `AskUserQuestion` if available; no such tool is available in this environment.

## 5. Design direction comparison

These are proposals for comparison, not finalized token systems. All retain the confirmed creator-first workflow, Quiet Vitality qualities, deliberate light/dark design objective, and optional writer-side AI.

| Direction | Personality and color | Type, layout, surfaces, and motion | Morrow fit, distinction, and trade-off |
| --- | --- | --- | --- |
| **Quiet Vitality** *(working preference)* | Warm paper and soft white in light mode; deep warm charcoal/green-black in dark mode; green used for meaningful actions, selection, and progress rather than decoration. Candidate colors require contrast checks. | Editorial display voice paired with highly legible UI and reading faces; evaluate Inter + Space Grotesk rather than assume. Writer-first central canvas, compact surrounding controls, optional AI panel that yields space to the work. Fine rules and tonal surfaces; minimal elevation. Immediate routine feedback, expressive only when the assistant panel or a meaningful content state changes. | Best synthesis of the confirmed personality and workflows. Distinctiveness comes from type hierarchy, writing-first composition, and a restrained green signature. Gives up loud brand color, high dashboard density, and ornament; risks feeling generic if typography and signature details are not authored. |
| **Paper & Ink** | Warm ivory, chalk, and ink-like dark surfaces; green shifts toward an earthy, deeper accent. Light paper character remains primary while dark mode is separately tuned rather than inverted. | Strong editorial serif or humanist display paired with a quiet sans for UI; wide, calm writing column; lists use compact typographic rows. Hairline separators, little/no shadow, squared-to-soft corners. Low-motion, almost print-like transitions. | Strongest for sustained writing and distinct editorial identity, avoiding common AI SaaS cues. Gives up some contemporary product crispness and may feel too literary or slow for platform adaptation and operational flows. |
| **Field Notes** | Warm neutral grounds with restrained botanical green and small, low-chroma supporting tones only where status meaning requires them. Avoid literal leaf/nature graphics. | Editorial headings with clear sans UI; content organized as a sequence of notes, sources, drafts, and decisions; adaptable list density. Paper-like surfaces, annotation rules, selective markers instead of cards; subtle motion emphasizes continuity and provenance. | Makes Possibility and Continuity tangible through idea-to-draft relationships. Avoids generic AI composition through source/lineage details. Risks resembling a notes/journaling product and underplaying editing, approval, and publishing operations. |
| **Quiet Instrument** | Warm graphite and paper neutrals, restrained green as a single instrument/status signal; themes receive independent contrast tuning. | Modern grotesk-led hierarchy with editorial treatment reserved for writing; efficient navigation and content lists around a broad editor; optional assistant appears as a tool panel. Crisp borders, minimal depth, precise short transitions and reduced-motion fallback. | Strong for daily workflow clarity, fast capture, editing, and a compact AI panel; distinct through disciplined tool layout rather than visual effects. Gives up some warmth and editorial character; can drift toward a generic productivity or developer-tool interface if density, mono type, and chrome dominate. |

## 6. Recommendation

Recommend **Quiet Vitality**, with the writing-first composition and restrained operational clarity described above. It aligns directly with the user's current working preference while serving long reading/writing sessions, manual work, and optional AI support. Its central trade-off is choosing focus and authored typographic identity over a louder marketing-style brand or maximum dashboard density.

Use Paper & Ink and Quiet Instrument as real counterpoints: the first tests whether Morrow should lean more literary, while the second tests whether efficiency should outweigh warmth. Field Notes tests whether the continuity/provenance story should be more visible. Do not produce final color, font, spacing, or radius tokens until the direction is approved and candidates are evaluated against actual screens and contrast requirements.

## 7. Planner readiness

**Ready for a direction review; not ready for final token authoring or `DESIGN.md` generation.** Product purpose, workflow, confirmed Studio intent, visual hypothesis, technology constraints, and current implementation evidence are now available. Four meaningfully different directions and their trade-offs are prepared.

Remaining limitations: no visual references from the owner; provisional colors and typography need evaluation; actual theme behavior and responsive Studio needs are open; implementation contains split storage/editor paths; planner reference/spec/CLI/template/example files are empty or absent. The skill requires a Google-format YAML-frontmatter `DESIGN.md`, component-linked tokens, contrast-checkable pairs, CLI lint, and a fresh-eye review, but the missing support files limit validation against its detailed schema. No CLI was run and no final design document was generated in this preparation phase.

## 8. Approval checklist

Only these inputs materially affect the next planner step:

- [ ] Approve **Quiet Vitality** as the selected direction, or choose one of the alternatives as the stronger anchor.
- [ ] Share 2–3 visual references whose typography, composition, or interaction language you would defend; the planner explicitly recommends concrete references.
- [ ] Confirm whether both light and dark themes must ship in the initial experience. The design goal is confirmed; release scope and default/selection behavior are not.
- [ ] Confirm whether the planner may use its documented Google CLI lint workflow later. It may require package/network access; no dependency or command was used here.

Typeface, exact colors, and component choices can remain design proposals for the token review rather than requiring approval now.

## 9. Proposed next step

Review and approve the direction (and provide visual references/theme scope if available). Then continue with the Design MD Planner in codify-existing/mixed mode: extract and judge current tokens and component usage, translate the selected direction into explicit candidate tokens, inspect colors and type in representative writing/list/panel contexts, and only then draft the Google-format `DESIGN.md`. At that later stage, restore or verify the missing skill references and CLI schema before linting. Keep the current app and existing tokens intact until any separate implementation request is approved.
