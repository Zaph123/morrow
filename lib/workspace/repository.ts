import { createId } from "@/lib/workspace/id"
import { sortByUpdatedDesc } from "@/lib/sort"
import { deriveTitle } from "@/lib/workspace/title"
import {
  readWorkspace,
  writeWorkspace,
  type StorageResult,
} from "@/lib/workspace/storage"
import type {
  ContentItem,
  ContentPlatform,
  Idea,
  WorkspaceSnapshot,
} from "@/lib/workspace/types"

export type WorkspaceMutationResult<T> = StorageResult<T>

function nowIso(): string {
  return new Date().toISOString()
}

export function listIdeas(): StorageResult<Idea[]> {
  const result = readWorkspace()
  if (!result.ok) return result
  return { ok: true, data: sortByUpdatedDesc(result.data.ideas) }
}

export function getIdea(id: string): StorageResult<Idea | null> {
  const result = readWorkspace()
  if (!result.ok) return result
  return {
    ok: true,
    data: result.data.ideas.find((idea) => idea.id === id) ?? null,
  }
}

export function createIdea(body: string): WorkspaceMutationResult<Idea> {
  const trimmed = body.trim()
  if (!trimmed) {
    return { ok: false, error: "Write a thought before saving." }
  }

  const current = readWorkspace()
  if (!current.ok) return current

  const stamp = nowIso()
  const idea: Idea = {
    id: createId(),
    body: trimmed,
    createdAt: stamp,
    updatedAt: stamp,
  }

  const next: WorkspaceSnapshot = {
    ...current.data,
    ideas: [idea, ...current.data.ideas],
  }

  const saved = writeWorkspace(next)
  if (!saved.ok) return saved
  return { ok: true, data: idea }
}

export function updateIdea(
  id: string,
  body: string
): WorkspaceMutationResult<Idea> {
  const trimmed = body.trim()
  if (!trimmed) {
    return { ok: false, error: "An idea needs some text." }
  }

  const current = readWorkspace()
  if (!current.ok) return current

  const index = current.data.ideas.findIndex((idea) => idea.id === id)
  if (index === -1) {
    return { ok: false, error: "That idea could not be found." }
  }

  const existing = current.data.ideas[index]!
  if (existing.body === body) return { ok: true, data: existing }
  const updated: Idea = {
    ...existing,
    body,
    updatedAt: nowIso(),
  }

  const ideas = [...current.data.ideas]
  ideas[index] = updated

  const saved = writeWorkspace({ ...current.data, ideas })
  if (!saved.ok) return saved
  return { ok: true, data: updated }
}

/**
 * Deletes an idea without deleting related content.
 * Content items keep sourceIdeaId; the UI treats a missing idea as unavailable.
 */
export function deleteIdea(id: string): WorkspaceMutationResult<{ id: string }> {
  const current = readWorkspace()
  if (!current.ok) return current

  if (!current.data.ideas.some((idea) => idea.id === id)) {
    return { ok: false, error: "That idea could not be found." }
  }

  const saved = writeWorkspace({
    ...current.data,
    ideas: current.data.ideas.filter((idea) => idea.id !== id),
  })
  if (!saved.ok) return saved
  return { ok: true, data: { id } }
}

export function listContent(): StorageResult<ContentItem[]> {
  const result = readWorkspace()
  if (!result.ok) return result
  return { ok: true, data: sortByUpdatedDesc(result.data.content) }
}

export function getContent(id: string): StorageResult<ContentItem | null> {
  const result = readWorkspace()
  if (!result.ok) return result
  return {
    ok: true,
    data: result.data.content.find((item) => item.id === id) ?? null,
  }
}

export function listContentForIdea(
  ideaId: string
): StorageResult<ContentItem[]> {
  const result = readWorkspace()
  if (!result.ok) return result
  return {
    ok: true,
    data: sortByUpdatedDesc(
      result.data.content.filter((item) => item.sourceIdeaId === ideaId)
    ),
  }
}

export type CreateContentInput = {
  body?: string
  title?: string
  platform?: ContentPlatform | null
  sourceIdeaId?: string | null
}

export function createContent(
  input: CreateContentInput = {}
): WorkspaceMutationResult<ContentItem> {
  const current = readWorkspace()
  if (!current.ok) return current

  const sourceIdeaId = input.sourceIdeaId ?? null
  if (sourceIdeaId) {
    const ideaExists = current.data.ideas.some((idea) => idea.id === sourceIdeaId)
    if (!ideaExists) {
      return {
        ok: false,
        error: "The source idea is missing, so a draft could not be created from it.",
      }
    }
  }

  const body = input.body?.trim() ?? ""
  const stamp = nowIso()
  const item: ContentItem = {
    id: createId(),
    title: input.title?.trim() || deriveTitle(body),
    body,
    status: "draft",
    platform: input.platform ?? null,
    sourceIdeaId,
    createdAt: stamp,
    updatedAt: stamp,
  }

  const saved = writeWorkspace({
    ...current.data,
    content: [item, ...current.data.content],
  })
  if (!saved.ok) return saved
  return { ok: true, data: item }
}

export type UpdateContentInput = {
  title?: string
  body?: string
  platform?: ContentPlatform | null
}

export function updateContent(
  id: string,
  input: UpdateContentInput
): WorkspaceMutationResult<ContentItem> {
  const current = readWorkspace()
  if (!current.ok) return current

  const index = current.data.content.findIndex((item) => item.id === id)
  if (index === -1) {
    return { ok: false, error: "That draft could not be found." }
  }

  const existing = current.data.content[index]!
  const body = input.body !== undefined ? input.body : existing.body
  const title =
    input.title !== undefined
      ? input.title.trim() || deriveTitle(body)
      : existing.title.trim()
        ? existing.title
        : deriveTitle(body)

  const updated: ContentItem = {
    ...existing,
    title,
    body,
    platform: input.platform !== undefined ? input.platform : existing.platform,
    status: "draft",
    updatedAt: nowIso(),
  }

  if (updated.title === existing.title && updated.body === existing.body && updated.platform === existing.platform) {
    return { ok: true, data: existing }
  }

  const content = [...current.data.content]
  content[index] = updated

  const saved = writeWorkspace({ ...current.data, content })
  if (!saved.ok) return saved
  return { ok: true, data: updated }
}

export function deleteContent(
  id: string
): WorkspaceMutationResult<{ id: string }> {
  const current = readWorkspace()
  if (!current.ok) return current

  if (!current.data.content.some((item) => item.id === id)) {
    return { ok: false, error: "That draft could not be found." }
  }

  const saved = writeWorkspace({
    ...current.data,
    content: current.data.content.filter((item) => item.id !== id),
  })
  if (!saved.ok) return saved
  return { ok: true, data: { id } }
}

/** Develop an idea into a new draft. The idea is left unchanged. */
export function developIdeaIntoContent(
  ideaId: string
): WorkspaceMutationResult<ContentItem> {
  const ideaResult = getIdea(ideaId)
  if (!ideaResult.ok) return ideaResult
  if (!ideaResult.data) {
    return { ok: false, error: "That idea could not be found." }
  }

  return createContent({
    body: ideaResult.data.body,
    title: deriveTitle(ideaResult.data.body),
    sourceIdeaId: ideaId,
  })
}
