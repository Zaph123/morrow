import {
  WORKSPACE_STORAGE_KEY,
  type ContentItem,
  type ContentPlatform,
  type Idea,
  type WorkspaceSnapshot,
} from "@/lib/workspace/types"

export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const PLATFORMS = new Set<ContentPlatform>(["x", "linkedin", "whatsapp"])

function emptySnapshot(): WorkspaceSnapshot {
  return { version: 1, ideas: [], content: [] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isIsoString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

function parseIdea(value: unknown): Idea | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== "string" || !value.id) return null
  if (typeof value.body !== "string") return null
  if (!isIsoString(value.createdAt) || !isIsoString(value.updatedAt)) return null
  return {
    ...value,
    id: value.id,
    body: value.body,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }
}

function parseContentItem(value: unknown): ContentItem | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== "string" || !value.id) return null
  if (typeof value.title !== "string") return null
  if (typeof value.body !== "string") return null
  if (value.status !== "draft") return null
  if (!isIsoString(value.createdAt) || !isIsoString(value.updatedAt)) return null

  let platform: ContentPlatform | null = null
  if (value.platform !== null && value.platform !== undefined) {
    if (typeof value.platform !== "string" || !PLATFORMS.has(value.platform as ContentPlatform)) {
      return null
    }
    platform = value.platform as ContentPlatform
  }

  let sourceIdeaId: string | null = null
  if (value.sourceIdeaId !== null && value.sourceIdeaId !== undefined) {
    if (typeof value.sourceIdeaId !== "string" || !value.sourceIdeaId) return null
    sourceIdeaId = value.sourceIdeaId
  }

  return {
    ...value,
    id: value.id,
    title: value.title,
    body: value.body,
    status: "draft",
    platform,
    sourceIdeaId,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }
}

function parseSnapshot(raw: unknown): WorkspaceSnapshot | null {
  if (!isRecord(raw)) return null
  if (raw.version !== 1) return null
  if (!Array.isArray(raw.ideas) || !Array.isArray(raw.content)) return null

  const ideas: Idea[] = []
  for (const item of raw.ideas) {
    const idea = parseIdea(item)
    if (!idea) return null
    ideas.push(idea)
  }

  const content: ContentItem[] = []
  for (const item of raw.content) {
    const entry = parseContentItem(item)
    if (!entry) return null
    content.push(entry)
  }

  return { ...raw, version: 1, ideas, content }
}

export function canUseLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  } catch {
    return false
  }
}

/** Read workspace data from localStorage. Safe on the server (returns empty). */
export function readWorkspace(): StorageResult<WorkspaceSnapshot> {
  if (typeof window === "undefined") {
    return { ok: true, data: emptySnapshot() }
  }

  try {
    if (!canUseLocalStorage()) throw new Error("Storage unavailable")
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw == null) {
      return { ok: true, data: emptySnapshot() }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return {
        ok: false,
        error: "Saved workspace data could not be read. It may be corrupted.",
      }
    }

    const snapshot = parseSnapshot(parsed)
    if (!snapshot) {
      return {
        ok: false,
        error: "Saved workspace data is not in a recognized format.",
      }
    }

    return { ok: true, data: snapshot }
  } catch {
    return {
      ok: false,
      error: "Browser storage is unavailable. Changes cannot be saved.",
    }
  }
}

export function writeWorkspace(
  snapshot: WorkspaceSnapshot
): StorageResult<WorkspaceSnapshot> {
  if (!canUseLocalStorage()) {
    return {
      ok: false,
      error: "Browser storage is unavailable. Changes cannot be saved.",
    }
  }

  try {
    // Even direct callers cannot replace unreadable existing data with a fresh snapshot.
    const current = readWorkspace()
    if (!current.ok) return current
    const validated = parseSnapshot(snapshot)
    if (!validated) return { ok: false, error: "Workspace changes are not in a recognized format. Keep or copy your work before leaving." }
    const payload: WorkspaceSnapshot = {
      ...validated,
      version: 1,
      ideas: validated.ideas,
      content: validated.content,
    }
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload))
    return { ok: true, data: payload }
  } catch {
    return {
      ok: false,
      error: "Could not save to browser storage. Storage may be full or blocked.",
    }
  }
}
