"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { notifyWorkspaceChanged } from "@/hooks/use-workspace"
import { createIdea } from "@/lib/workspace/repository"

type IdeaCaptureProps = {
  onSaved?: (ideaId: string) => void
  autofocus?: boolean
}

export function IdeaCapture({ onSaved, autofocus = false }: IdeaCaptureProps) {
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setError(null)

    const result = createIdea(body)
    if (!result.ok) {
      setError(result.error)
      setSaving(false)
      return
    }

    setBody("")
    setSaving(false)
    notifyWorkspaceChanged()
    onSaved?.(result.data.id)
  }

  return (
    <section
      className="rounded-2xl border border-border bg-card px-5 py-6"
      aria-labelledby="idea-capture-heading"
    >
      <h2
        id="idea-capture-heading"
        className="font-heading text-lg font-medium tracking-tight"
      >
        Quick capture
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Jot a thought in your own words. You can develop it into a draft later.
      </p>

      <label className="mt-5 block">
        <span className="sr-only">New idea</span>
        <Textarea
          value={body}
          onChange={(event) => {
            setBody(event.target.value)
            if (error) setError(null)
          }}
          rows={3}
          autoFocus={autofocus}
          placeholder="What just crossed your mind?"
          className="resize-y"
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault()
              void handleSave()
            }
          }}
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !body.trim()}
        >
          {saving ? "Saving…" : "Save idea"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Ctrl or ⌘ + Enter to save
        </p>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
