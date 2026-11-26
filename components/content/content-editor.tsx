"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SaveStatus, type SaveStatusKind } from "@/components/workspace/save-status"
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
import { cn } from "@/lib/utils"

export type ContentEditorMode =
  | { kind: "create"; sourceIdeaId?: string | null }
  | { kind: "edit"; contentId: string }

type ContentEditorProps = {
  mode: ContentEditorMode
}

const PLATFORM_OPTIONS: Array<{ value: "" | ContentPlatform; label: string }> =
  [
    { value: "", label: "No platform yet" },
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
  const seededFromIdea = useRef(false)

  useEffect(() => {
    if (!sourceIdeaId || !idea || seededFromIdea.current) return
    let active = true
    queueMicrotask(() => {
      if (!active || seededFromIdea.current) return
      seededFromIdea.current = true
      setBody(idea.body)
      setSaveStatus("dirty")
    })
    return () => { active = false }
  }, [idea, sourceIdeaId])

  if (sourceIdeaId && ideaStatus === "loading") {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Loading source idea…
      </p>
    )
  }

  if (sourceIdeaId && ideaStatus === "error") {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">{ideaError || "Could not load the source idea."}</p>
        <Button variant="secondary" className="mt-3" onClick={reload}>Try again</Button>
      </div>
    )
  }

  if (sourceIdeaId && !idea) {
    return (
      <section className="rounded-2xl border border-border bg-card px-5 py-6">
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Source idea not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You can still start a draft without that idea.
        </p>
        <Link
          href="/content/new"
          className={cn(buttonVariants({ variant: "default" }), "mt-5")}
        >
          Start a blank draft
        </Link>
      </section>
    )
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
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Loading draft…
      </p>
    )
  }

  if (status === "error" && !savedItem) {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">{error || "Could not load this draft."}</p>
        <Button variant="secondary" className="mt-3" onClick={reload}>Try again</Button>
      </div>
    )
  }

  if (!item && !savedItem) {
    return (
      <section className="rounded-2xl border border-border bg-card px-5 py-6">
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Draft not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been deleted, or the link is out of date.
        </p>
        <Link
          href="/content"
          className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
        >
          Back to Content
        </Link>
      </section>
    )
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
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {status === "error" && <div>
        <p className="text-sm text-destructive" role="alert">{error} Your current text is retained below. Keep or copy it before leaving.</p>
        <Button variant="secondary" className="mt-3" onClick={reload}>Try loading again</Button>
      </div>}
      {status === "ready" && !item && savedItem && <p className="text-sm text-destructive" role="alert">The stored draft is no longer available. Your current text is retained below; keep or copy it before leaving.</p>}
      <EditorChrome
        heading="Edit draft"
        description="Changes save to this content item only. The source idea is not updated."
        backHref="/content"
        backLabel="All content"
        sourcePanel={
          sourceIdea ? (
            <SourceIdeaPanel ideaId={sourceIdea.id} body={sourceIdea.body} />
          ) : sourceMissing ? (
            <p className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
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
    <aside className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Source idea</p>
        <Link
          href={`/ideas/${ideaId}`}
          className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}
        >
          Open idea
        </Link>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {previewText(body, 220) || "Empty idea"}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Shown for context only. Editing the draft does not change this idea.
      </p>
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
}: EditorChromeProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h1 className="font-display text-[2rem] font-normal leading-10 tracking-[-0.02em] text-balance">
            {heading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <Link
          href={backHref}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          {backLabel}
        </Link>
      </div>

      {sourcePanel}

      <section className="rounded-2xl border border-border bg-card px-5 py-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Title</span>
            <Input
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Untitled draft"
              className="mt-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Draft</span>
            <Textarea
              value={body}
              onChange={(event) => onBodyChange(event.target.value)}
              rows={12}
              placeholder="Write the piece here…"
              className="mt-2 min-h-48 text-lg leading-[1.65]"
            />
          </label>

          <label className="block max-w-xs">
            <span className="text-sm font-medium text-foreground">
              Intended platform
            </span>
            <Select
              value={platform}
              onChange={(event) =>
                onPlatformChange(event.target.value as "" | ContentPlatform)
              }
              className="mt-2"
            >
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.value || "none"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={onSave} disabled={saveDisabled}>
            {saveLabel}
          </Button>
          <SaveStatus status={saveStatus} error={saveError} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Status: Draft</p>
      </section>
    </div>
  )
}
