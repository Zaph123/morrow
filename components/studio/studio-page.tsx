"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lightbulb } from "lucide-react"
import Link from "next/link"
import { StudioStartPage } from "@/components/studio/studio-start-page"

import {
  StudioEditorSkeleton,
  WritingSurface,
  WritingSurfaceState,
  type WritingPlatformOption,
} from "@/components/studio/writing-surface"
import {
  createContent,
  getContentItem,
  getIdea,
  updateContent,
} from "@/lib/storage"
import type { ContentItem, ContentPlatform, Idea } from "@/types"

const PLATFORMS: WritingPlatformOption[] = [
  { value: "", label: "Choose platform" },
  { value: "x", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp-status", label: "WhatsApp Status" },
]

export function StudioPage({ newDraft = false }: { newDraft?: boolean }) {
  const searchParams = useSearchParams()
  const contentId = searchParams?.get("contentId") ?? null
  const sourceIdeaId = searchParams?.get("sourceIdeaId") ?? null
  if (!newDraft && !contentId && !sourceIdeaId) return <StudioStartPage />
  return (
    <StudioEditor
      key={`${contentId ?? "new"}:${sourceIdeaId ?? "blank"}`}
      contentId={contentId}
      sourceIdeaId={sourceIdeaId}
    />
  )
}

function StudioEditor({
  contentId,
  sourceIdeaId,
}: {
  contentId: string | null
  sourceIdeaId: string | null
}) {
  const router = useRouter()
  const [sourceIdea, setSourceIdea] = useState<Idea | null>(null)
  const [existingContent, setExistingContent] = useState<ContentItem | null>(null)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [platform, setPlatform] = useState<ContentPlatform>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const dirty = !existingContent || title !== existingContent.title || body !== existingContent.body || platform !== existingContent.platform
  const saveStatus = isSaving
    ? "saving"
    : saveError
      ? "error"
      : dirty
        ? "dirty"
        : "saved"

  const loadContext = useCallback(() => {
    try {
      if (contentId) {
        const content = getContentItem(contentId)
        if (!content) throw new Error("This draft could not be found. Return to the library to choose another draft.")
        const source = content.sourceIdeaId ? getIdea(content.sourceIdeaId) : null
        setExistingContent(content)
        setTitle(content.title)
        setBody(content.body)
        setPlatform(content.platform)
        setSourceIdea(source)
      } else if (sourceIdeaId) {
        const idea = getIdea(sourceIdeaId)
        if (!idea) throw new Error("The source idea could not be found. Return to Ideas to choose another idea.")
        setSourceIdea(idea)
        setBody(idea.text)
      }
      setLoadError(null)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load your writing.")
    } finally {
      setMounted(true)
    }
  }, [contentId, sourceIdeaId])

  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) loadContext() })
    return () => { active = false }
  }, [loadContext])

  async function handleSave() {
    const trimmedTitle = title.trim() || "Untitled"
    if (!body.trim() || isSaving || loadError) return

    setIsSaving(true)
    setSaveError(null)

    try {
      if (existingContent) {
        const updated = updateContent(existingContent.id, {
          title: trimmedTitle,
          body,
          platform,
        })
        if (!updated) throw new Error("This draft is no longer available. Keep or copy your writing before leaving.")
        setExistingContent(updated)
        setTitle(updated.title)
      } else {
        const created = createContent({
          title: trimmedTitle,
          body,
          platform,
          sourceIdeaId: sourceIdeaId || undefined,
        })
        setExistingContent(created)
        setTitle(created.title)
        router.replace(`/studio?contentId=${created.id}`)
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your draft. Try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loadError) {
    return (
      <WritingSurfaceState
        parentLabel={sourceIdeaId ? "Ideas" : "Library"}
        backHref={sourceIdeaId ? "/ideas" : "/content"}
        backLabel={sourceIdeaId ? "Back to Ideas" : "Back to Library"}
        title="Couldn’t load your writing"
        message={loadError}
        actionLabel="Try again"
        onAction={loadContext}
      />
    )
  }

  if (!mounted) return <StudioEditorSkeleton />

  const backHref = existingContent
    ? "/content"
    : sourceIdea
      ? `/ideas/${sourceIdea.id}`
      : "/"
  const backLabel = existingContent
    ? "Back to Library"
    : sourceIdea
      ? "Back to idea"
      : "Back to Home"

  return (
    <WritingSurface
      parentLabel={existingContent ? "Library" : sourceIdea ? "Ideas" : "Studio"}
      backHref={backHref}
      backLabel={backLabel}
      title={title}
      body={body}
      platform={platform}
      platformOptions={PLATFORMS}
      onTitleChange={(value) => { setTitle(value); setSaveError(null) }}
      onBodyChange={(value) => { setBody(value); setSaveError(null) }}
      onPlatformChange={(value) => { setPlatform((value || null) as ContentPlatform); setSaveError(null) }}
      sourcePanel={sourceIdea ? <LegacySourceIdea idea={sourceIdea} /> : undefined}
      sourceUnavailable={existingContent?.sourceIdeaId && !sourceIdea ? (
        <p className="studio-source-unavailable">The original idea is unavailable. Your draft and its source reference are preserved.</p>
      ) : undefined}
      saveLabel={isSaving ? "Saving…" : saveError ? "Retry save" : existingContent ? "Save changes" : "Save draft"}
      saveDisabled={isSaving || !body.trim()}
      onSave={handleSave}
      saveStatus={saveStatus}
      saveError={saveError}
    />
  )
}

function LegacySourceIdea({ idea }: { idea: Idea }) {
  return (
    <aside className="studio-source-context">
      <Lightbulb size={16} aria-hidden="true" />
      <span className="studio-source-label">From idea</span>
      <p>{idea.text}</p>
      <Link href={`/ideas/${idea.id}`}>View idea</Link>
    </aside>
  )
}
