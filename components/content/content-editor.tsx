"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { WritingSurface, WritingSurfaceState, StudioEditorSkeleton, type WritingPlatformOption } from "@/components/studio/writing-surface"
import { type SaveStatusKind } from "@/components/workspace/save-status"
import {
  notifyWorkspaceChanged,
  useContentItem,
  useIdea,
} from "@/hooks/use-workspace"
import { previewText } from "@/lib/workspace/title"
import {
  createContent,
  deleteContent,
  updateContent,
} from "@/lib/workspace/repository"
import {
  PLATFORM_LABELS,
  type ContentItem,
  type ContentPlatform,
} from "@/lib/workspace/types"

export type ContentEditorMode =
  | { kind: "create"; sourceIdeaId?: string | null }
  | { kind: "edit"; contentId: string }

type ContentEditorProps = {
  mode: ContentEditorMode
}

const PLATFORM_OPTIONS: WritingPlatformOption[] =
  [
    { value: "", label: "Choose platform" },
    { value: "x", label: PLATFORM_LABELS.x },
    { value: "linkedin", label: PLATFORM_LABELS.linkedin },
    { value: "whatsapp", label: PLATFORM_LABELS.whatsapp },
  ]

export function ContentEditor({ mode }: ContentEditorProps) {
  if (mode.kind === "create") {
    return <CreateContentEditor key={mode.sourceIdeaId ?? "blank"} sourceIdeaId={mode.sourceIdeaId ?? null} />
  }
  return <EditContentEditor key={mode.contentId} contentId={mode.contentId} />
}

function CreateContentEditor({ sourceIdeaId }: { sourceIdeaId: string | null }) {
  const router = useRouter()
  const { status: ideaStatus, idea, error: ideaError, reload } = useIdea(
    sourceIdeaId ?? undefined
  )
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [platform, setPlatform] = useState<"" | ContentPlatform>("")
  const [saveStatus, setSaveStatus] = useState<SaveStatusKind>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [created, setCreated] = useState(false)
  const [seededFromIdea, setSeededFromIdea] = useState(false)

  useEffect(() => {
    if (!sourceIdeaId || !idea || seededFromIdea) return
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setSeededFromIdea(true)
      setBody(idea.body)
      setSaveStatus("dirty")
    })
    return () => { active = false }
  }, [idea, seededFromIdea, sourceIdeaId])

  if (sourceIdeaId && idea && !seededFromIdea) {
    return <StudioEditorSkeleton label="Preparing draft from idea" />
  }

  if (sourceIdeaId && ideaStatus === "loading") {
    return <StudioEditorSkeleton label="Loading source idea" />
  }

  if (sourceIdeaId && ideaStatus === "error") {
    return <WritingSurfaceState parentLabel="Ideas" backHref="/ideas" backLabel="Back to Ideas" title="Couldn’t load the source idea" message={ideaError || "Could not load the source idea."} actionLabel="Try again" onAction={reload} />
  }

  if (sourceIdeaId && !idea) {
    return <WritingSurfaceState parentLabel="Ideas" backHref="/ideas" backLabel="Back to Ideas" title="Source idea not found" message="You can still start a draft without that idea." actionLabel="Start a blank draft" actionHref="/content/new" />
  }

  function handleCreate() {
    if (created || saveStatus === "saving") return
    setSaveStatus("saving")
    setSaveError(null)

    const result = createContent({
      title,
      body,
      platform: platform || null,
      sourceIdeaId,
    })

    if (!result.ok) {
      setSaveStatus("error")
      setSaveError(result.error)
      return
    }

    setCreated(true)
    setSaveStatus("saved")
    notifyWorkspaceChanged()
    router.replace(`/content/${result.data.id}`)
  }

  return (
    <EditorChrome
      heading={sourceIdeaId ? "New draft from idea" : "New draft"}
      description={
        sourceIdeaId
          ? "Write freely. Saving creates a content item linked to the idea, without changing the idea itself."
          : "Start writing. This draft does not need a source idea."
      }
      backHref={sourceIdeaId && idea ? `/ideas/${idea.id}` : "/content"}
      backLabel={sourceIdeaId && idea ? "Back to idea" : "All content"}
      sourcePanel={
        idea ? (
          <SourceIdeaPanel ideaId={idea.id} body={idea.body} />
        ) : undefined
      }
      title={title}
      body={body}
      platform={platform}
      onTitleChange={(value) => {
        setTitle(value)
        setSaveStatus("dirty")
        setSaveError(null)
      }}
      onBodyChange={(value) => {
        setBody(value)
        setSaveStatus("dirty")
        setSaveError(null)
      }}
      onPlatformChange={(value) => {
        setPlatform(value)
        setSaveStatus("dirty")
        setSaveError(null)
      }}
      saveLabel={saveStatus === "saving" ? "Creating…" : "Create draft"}
      saveDisabled={created || saveStatus === "saving"}
      onSave={handleCreate}
      saveStatus={saveStatus === "idle" ? "dirty" : saveStatus}
      saveError={saveError}
    />
  )
}

function EditContentEditor({ contentId }: { contentId: string }) {
  const router = useRouter()
  const { status, item, sourceIdea, sourceMissing, error, reload } =
    useContentItem(contentId)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [platform, setPlatform] = useState<"" | ContentPlatform>("")
  const [saveStatus, setSaveStatus] = useState<SaveStatusKind>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const loadedId = useRef<string | null>(null)
  const [savedItem, setSavedItem] = useState<ContentItem | null>(null)
  const dirty = savedItem !== null && (title !== savedItem.title || body !== savedItem.body || (platform || null) !== savedItem.platform)
  const currentSaveStatus = saveStatus === "error" || saveStatus === "saving" ? saveStatus : dirty ? "dirty" : "saved"

  useEffect(() => {
    if (!item) return
    if (loadedId.current === item.id) return
    let active = true
    queueMicrotask(() => {
      if (!active || loadedId.current === item.id) return
      loadedId.current = item.id
      setSavedItem(item)
      setTitle(item.title)
      setBody(item.body)
      setPlatform(item.platform ?? "")
      setSaveStatus("idle")
      setSaveError(null)
    })
    return () => { active = false }
  }, [item])

  if (status === "loading" || (status === "ready" && item && !savedItem)) {
    return <StudioEditorSkeleton label="Loading draft" />
  }

  if (status === "error" && !savedItem) {
    return <WritingSurfaceState parentLabel="Library" backHref="/content" backLabel="Back to Library" title="Couldn’t load this draft" message={error || "Could not load this draft."} actionLabel="Try again" onAction={reload} />
  }

  if (!item && !savedItem) {
    return <WritingSurfaceState parentLabel="Library" backHref="/content" backLabel="Back to Library" title="Draft not found" message="It may have been deleted, or the link is out of date." actionLabel="Back to Content" actionHref="/content" />
  }

  function handleSave() {
    if (saveStatus === "saving") return
    setSaveStatus("saving")
    setSaveError(null)

    const result = updateContent(contentId, {
      title,
      body,
      platform: platform || null,
    })

    if (!result.ok) {
      setSaveStatus("error")
      setSaveError(result.error)
      return
    }

    loadedId.current = result.data.id
    setSavedItem(result.data)
    setTitle(result.data.title)
    setBody(result.data.body)
    setPlatform(result.data.platform ?? "")
    setSaveStatus("saved")
    notifyWorkspaceChanged()
  }

  function handleDelete() {
    if (deleting) return
    setDeleting(true)
    setDeleteError(null)
    const result = deleteContent(contentId)
    if (!result.ok) {
      setDeleteError(result.error)
      setDeleting(false)
      setConfirmDelete(false)
      return
    }
    notifyWorkspaceChanged()
    router.push("/content")
  }

  return (
    <div className="mx-auto w-full max-w-[54.5rem] space-y-6">
      <EditorChrome
        heading="Edit draft"
        description="Changes save to this content item only. The source idea is not updated."
        backHref="/content"
        backLabel="All content"
        sourcePanel={
          sourceIdea ? (
            <SourceIdeaPanel ideaId={sourceIdea.id} body={sourceIdea.body} />
          ) : sourceMissing ? (
            <p className="studio-source-unavailable">
              This draft came from an idea that is no longer available. The draft
              remains editable on its own.
            </p>
          ) : undefined
        }
        title={title}
        body={body}
        platform={platform}
        onTitleChange={(value) => {
          setTitle(value)
          setSaveStatus("dirty")
          setSaveError(null)
        }}
        onBodyChange={(value) => {
          setBody(value)
          setSaveStatus("dirty")
          setSaveError(null)
        }}
        onPlatformChange={(value) => {
          setPlatform(value)
          setSaveStatus("dirty")
          setSaveError(null)
        }}
        saveLabel={saveStatus === "saving" ? "Saving…" : saveStatus === "error" ? "Retry save" : "Save changes"}
        saveDisabled={saveStatus === "saving" || (!dirty && saveStatus !== "error")}
        onSave={handleSave}
        saveStatus={currentSaveStatus}
        saveError={saveError}
        notice={status === "error" ? (
          <div className="studio-editor-notice">
            <p role="alert">{error} Your current text is retained below. Keep or copy it before leaving.</p>
            <Button variant="secondary" className="mt-3" onClick={reload}>Try loading again</Button>
          </div>
        ) : status === "ready" && !item && savedItem ? (
          <p className="studio-editor-notice" role="alert">The stored draft is no longer available. Your current text is retained below; keep or copy it before leaving.</p>
        ) : undefined}
      />

      <section className="rounded-2xl border border-border px-5 py-6">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Delete draft
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This removes the content item only. Any source idea is left alone.
        </p>
        {deleteError && <p className="mt-3 text-sm text-destructive" role="alert">{deleteError} Your draft is retained. Retry Delete draft when ready.</p>}
        {!confirmDelete ? (
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            onClick={() => setConfirmDelete(true)}
          >
            Delete draft
          </Button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Confirm delete"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

function SourceIdeaPanel({ ideaId, body }: { ideaId: string; body: string }) {
  return (
    <aside className="studio-source-context">
      <span className="studio-source-label">From idea</span>
      <p>{previewText(body, 220) || "Empty idea"}</p>
      <Link href={`/ideas/${ideaId}`}>View idea</Link>
      <span className="studio-source-note">Editing this draft does not change the original idea.</span>
    </aside>
  )
}

type EditorChromeProps = {
  heading: string
  description: string
  backHref: string
  backLabel: string
  sourcePanel?: ReactNode
  title: string
  body: string
  platform: "" | ContentPlatform
  onTitleChange: (value: string) => void
  onBodyChange: (value: string) => void
  onPlatformChange: (value: "" | ContentPlatform) => void
  saveLabel: string
  saveDisabled: boolean
  onSave: () => void
  saveStatus: SaveStatusKind
  saveError: string | null
  notice?: ReactNode
}

function EditorChrome({
  heading,
  description,
  backHref,
  backLabel,
  sourcePanel,
  title,
  body,
  platform,
  onTitleChange,
  onBodyChange,
  onPlatformChange,
  saveLabel,
  saveDisabled,
  onSave,
  saveStatus,
  saveError,
  notice,
}: EditorChromeProps) {
  return (
    <WritingSurface
      parentLabel={backLabel === "Back to idea" ? "Ideas" : "Library"}
      backHref={backHref}
      backLabel={backLabel}
      description={description}
      titlePlaceholder={heading}
      title={title}
      body={body}
      platform={platform || null}
      platformOptions={PLATFORM_OPTIONS}
      onTitleChange={onTitleChange}
      onBodyChange={onBodyChange}
      onPlatformChange={(value) => onPlatformChange(value as "" | ContentPlatform)}
      sourcePanel={sourcePanel}
      notice={notice}
      saveLabel={saveLabel}
      saveDisabled={saveDisabled || !body.trim()}
      onSave={onSave}
      saveStatus={saveStatus}
      saveError={saveError}
    />
  )
}
