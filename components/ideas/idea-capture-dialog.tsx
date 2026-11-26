"use client"

import { useEffect, useRef } from "react"

import { Alert } from "@/components/arc/alert/alert"
import { Dialog, DialogContent } from "@/components/arc/dialog/dialog"
import { useIdeaCapture } from "@/components/ideas/idea-capture-context"
import { Button } from "@/components/ui/button"
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer"
import { Textarea } from "@/components/ui/textarea"

export function IdeaCaptureDialog() {
  const {
    open,
    text,
    error,
    saving,
    discardOpen,
    setText,
    requestClose,
    confirmDiscard,
    cancelDiscard,
    save,
  } = useIdeaCapture()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wasDiscardOpen = useRef(false)

  useEffect(() => {
    const returnedFromDiscard = wasDiscardOpen.current && !discardOpen && open
    wasDiscardOpen.current = discardOpen
    if (!returnedFromDiscard) return
    const frame = window.requestAnimationFrame(() => textareaRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [discardOpen, open])

  return (
    <>
      <ResponsiveDialogDrawer
        open={open}
        onRequestClose={requestClose}
        title="New idea"
        description="Capture a thought. It stays on this device until you save it."
        dialogClassName="morrow-capture-dialog"
        sheetClassName="morrow-capture-sheet"
        dismissLocked={discardOpen}
      >
        <div
          className="idea-capture-form"
          onKeyDownCapture={(event) => {
            if (event.key !== "Escape") return
            if (discardOpen) return
            event.preventDefault()
            event.stopPropagation()
            requestClose()
          }}
        >
          <label className="idea-capture-field block">
            <span className="sr-only">Capture an idea</span>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  void save()
                }
              }}
              autoFocus
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "idea-capture-save-error" : undefined}
              rows={4}
              placeholder="What just crossed your mind?"
              className="idea-capture-textarea resize-none"
              disabled={saving}
            />
          </label>

          {error ? (
            <Alert
              id="idea-capture-save-error"
              tone="danger"
              title="Couldn’t save this idea"
              className="mt-3"
            >
              {error} Your text is preserved. Retry with Save idea.
            </Alert>
          ) : null}

          <div className="idea-capture-actions mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Cmd+Enter to save</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={requestClose}
                disabled={saving}
                className="min-h-11"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void save()}
                disabled={!text.trim() || saving}
                size="sm"
                className="min-h-11"
              >
                {saving ? "Saving..." : "Save idea"}
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveDialogDrawer>

      <Dialog
        open={discardOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) cancelDiscard()
        }}
      >
        <DialogContent
          title="Discard idea?"
          description="Your unsaved text will be cleared. This cannot be undone."
        >
          <div className="morrow-dialog-actions">
            <Button type="button" variant="ghost" onClick={cancelDiscard}>
              Keep editing
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDiscard}>
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
