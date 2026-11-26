/** Local-first workspace models for Phase 1 (ideas + content drafts). */

export type ContentStatus = "draft"

export type ContentPlatform = "x" | "linkedin" | "whatsapp"

export type Idea = {
  id: string
  /** Original thought, preserved as captured/edited by the creator. */
  body: string
  createdAt: string
  updatedAt: string
}

export type ContentItem = {
  id: string
  title: string
  body: string
  status: ContentStatus
  /** Intended platform when the creator has chosen one; otherwise null. */
  platform: ContentPlatform | null
  /**
   * Provenance link to the idea this draft was developed from.
   * Null when the content was started from scratch.
   * May point at a deleted idea; the draft remains independently editable.
   */
  sourceIdeaId: string | null
  createdAt: string
  updatedAt: string
}

export type WorkspaceSnapshot = {
  version: 1
  ideas: Idea[]
  content: ContentItem[]
}

export const WORKSPACE_STORAGE_KEY = "morrow.workspace.v1"

export const PLATFORM_LABELS: Record<ContentPlatform, string> = {
  x: "X",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp Status",
}
