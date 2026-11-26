# Phase 1 — Local workspace notes

Short decisions for the first usable capture → draft workflow.

## Object model

- **Idea:** original thought (`body`, timestamps). Never converted in place into a draft.
- **Content item:** independently editable draft (`title`, `body`, `status: "draft"`, optional `platform`, optional `sourceIdeaId`).
- One idea may have many content items. Content may exist with `sourceIdeaId: null`.

## Relationship policy

- `sourceIdeaId` records provenance only. Editing either side does not sync the other.
- **Deleting an idea** removes the idea record only. Related content items keep their `sourceIdeaId`. The UI shows that the source idea is unavailable. Drafts remain fully editable.
- **Deleting a draft** does not modify its source idea.

## Persistence

- Storage key: `morrow.workspace.v1` in `localStorage`.
- Access goes through `lib/workspace/storage.ts` and `lib/workspace/repository.ts` so a later backend can replace the storage layer without rewriting pages.
- Limitations: data is per-browser/profile, not synced, and can be cleared by the user or site data eviction. Malformed payloads surface an error instead of silent data loss.

## Shared creation experience

- Component: `components/content/content-editor.tsx`
- Routes: `/content/new` (optional `?from=<ideaId>`), `/content/[id]`
- Developing from an idea detail creates one content item then navigates to `/content/[id]` (button disabled while creating) to avoid duplicate drafts from repeated clicks.
