"use client"

import { useCallback, useSyncExternalStore } from "react"
import { sortByUpdatedDesc } from "@/lib/sort"

import { readWorkspace } from "@/lib/workspace/storage"
import type { ContentItem, Idea, WorkspaceSnapshot } from "@/lib/workspace/types"

type LoadState = "loading" | "ready" | "error"

export type WorkspaceListState<T> = {
  status: LoadState
  items: T[]
  error: string | null
  reload: () => void
}

type WorkspaceView = {
  ready: boolean
  snapshot: WorkspaceSnapshot
  error: string | null
}

const EMPTY_SNAPSHOT: WorkspaceSnapshot = {
  version: 1,
  ideas: [],
  content: [],
}

const LOADING_VIEW: WorkspaceView = {
  ready: false,
  snapshot: EMPTY_SNAPSHOT,
  error: null,
}

const listeners = new Set<() => void>()
let revision = 0
let hydrated = false
let cachedRevision = -1
let cachedView: WorkspaceView = LOADING_VIEW
let hydrateScheduled = false

function emit() {
  revision += 1
  for (const listener of listeners) listener()
}

function readView(): WorkspaceView {
  const result = readWorkspace()
  if (!result.ok) {
    return {
      ready: true,
      snapshot: EMPTY_SNAPSHOT,
      error: result.error,
    }
  }
  return {
    ready: true,
    snapshot: result.data,
    error: null,
  }
}

function getClientSnapshot(): WorkspaceView {
  if (!hydrated) return LOADING_VIEW
  if (cachedRevision === revision) return cachedView
  cachedRevision = revision
  cachedView = readView()
  return cachedView
}

function getServerSnapshot(): WorkspaceView {
  return LOADING_VIEW
}

function scheduleHydration() {
  if (hydrated || hydrateScheduled || typeof window === "undefined") return
  hydrateScheduled = true
  queueMicrotask(() => {
    hydrated = true
    emit()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  scheduleHydration()
  return () => {
    listeners.delete(listener)
  }
}

/** Notify mounted hooks that local workspace data changed. */
export function notifyWorkspaceChanged() {
  if (!hydrated) {
    hydrated = true
  }
  cachedRevision = -1
  emit()
}

function useWorkspaceView() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}

export function useIdeas(): WorkspaceListState<Idea> {
  const view = useWorkspaceView()
  const reload = useCallback(() => {
    notifyWorkspaceChanged()
  }, [])

  if (!view.ready) {
    return { status: "loading", items: [], error: null, reload }
  }
  if (view.error) {
    return { status: "error", items: [], error: view.error, reload }
  }
  return {
    status: "ready",
    items: sortByUpdatedDesc(view.snapshot.ideas),
    error: null,
    reload,
  }
}

export function useContentItems(): WorkspaceListState<ContentItem> {
  const view = useWorkspaceView()
  const reload = useCallback(() => {
    notifyWorkspaceChanged()
  }, [])

  if (!view.ready) {
    return { status: "loading", items: [], error: null, reload }
  }
  if (view.error) {
    return { status: "error", items: [], error: view.error, reload }
  }
  return {
    status: "ready",
    items: sortByUpdatedDesc(view.snapshot.content),
    error: null,
    reload,
  }
}

export function useIdea(id: string | undefined) {
  const view = useWorkspaceView()
  const reload = useCallback(() => {
    notifyWorkspaceChanged()
  }, [])

  if (!view.ready) {
    return {
      status: "loading" as const,
      idea: null,
      related: [] as ContentItem[],
      error: null,
      reload,
    }
  }

  if (view.error) {
    return {
      status: "error" as const,
      idea: null,
      related: [] as ContentItem[],
      error: view.error,
      reload,
    }
  }

  if (!id) {
    return {
      status: "ready" as const,
      idea: null,
      related: [] as ContentItem[],
      error: null,
      reload,
    }
  }

  const idea = view.snapshot.ideas.find((entry) => entry.id === id) ?? null
  const related = sortByUpdatedDesc(
    view.snapshot.content.filter((item) => item.sourceIdeaId === id)
  )

  return {
    status: "ready" as const,
    idea,
    related,
    error: null,
    reload,
  }
}

export function useContentItem(id: string | undefined) {
  const view = useWorkspaceView()
  const reload = useCallback(() => {
    notifyWorkspaceChanged()
  }, [])

  if (!view.ready) {
    return {
      status: "loading" as const,
      item: null,
      sourceIdea: null,
      sourceMissing: false,
      error: null,
      reload,
    }
  }

  if (view.error) {
    return {
      status: "error" as const,
      item: null,
      sourceIdea: null,
      sourceMissing: false,
      error: view.error,
      reload,
    }
  }

  if (!id) {
    return {
      status: "ready" as const,
      item: null,
      sourceIdea: null,
      sourceMissing: false,
      error: null,
      reload,
    }
  }

  const item = view.snapshot.content.find((entry) => entry.id === id) ?? null
  let sourceIdea: Idea | null = null
  let sourceMissing = false

  if (item?.sourceIdeaId) {
    sourceIdea =
      view.snapshot.ideas.find((entry) => entry.id === item.sourceIdeaId) ??
      null
    sourceMissing = !sourceIdea
  }

  return {
    status: "ready" as const,
    item,
    sourceIdea,
    sourceMissing,
    error: null,
    reload,
  }
}
