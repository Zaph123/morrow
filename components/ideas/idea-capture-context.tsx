"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

import { useToastStack } from "@/components/arc/toast-stack/toast-stack"
import { createIdea } from "@/lib/storage"
import { notifyWorkspaceChanged } from "@/hooks/use-workspace"

export const IDEA_CAPTURE_OPEN_EVENT = "morrow:open-idea-capture"
export const IDEAS_CHANGED_EVENT = "morrow:ideas-changed"

type IdeaCaptureContextValue = {
  open: boolean
  text: string
  error: string | null
  saving: boolean
  discardOpen: boolean
  setText: (value: string) => void
  openCapture: () => void
  requestClose: () => boolean
  confirmDiscard: () => void
  cancelDiscard: () => void
  save: () => Promise<void>
  isDirty: boolean
}

const IdeaCaptureContext = createContext<IdeaCaptureContextValue | null>(null)

export function IdeaCaptureProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { toast } = useToastStack()
  const [open, setOpen] = useState(false)
  const [text, setTextState] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const isDirty = text.trim().length > 0

  const openCapture = useCallback(() => {
    setDiscardOpen(false)
    setError(null)
    setOpen(true)
  }, [])

  const forceClose = useCallback(() => {
    setOpen(false)
    setDiscardOpen(false)
    setError(null)
  }, [])

  const requestClose = useCallback(() => {
    if (saving) return false
    if (isDirty) {
      setDiscardOpen(true)
      return false
    }
    forceClose()
    return true
  }, [forceClose, isDirty, saving])

  const confirmDiscard = useCallback(() => {
    setTextState("")
    setError(null)
    setDiscardOpen(false)
    setOpen(false)
  }, [])

  const cancelDiscard = useCallback(() => {
    setDiscardOpen(false)
  }, [])

  const setText = useCallback((value: string) => {
    setTextState(value)
    setError(null)
  }, [])

  const save = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed || saving) return

    setSaving(true)
    setError(null)

    try {
      const idea = createIdea({ text: trimmed })
      setTextState("")
      setOpen(false)
      setDiscardOpen(false)
      notifyWorkspaceChanged()
      window.dispatchEvent(new Event(IDEAS_CHANGED_EVENT))
      toast({
        type: "success",
        title: "Saved on this device",
        action: {
          label: "View idea",
          onClick: () => router.push(`/ideas/${idea.id}`),
        },
      })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save your idea.",
      )
    } finally {
      setSaving(false)
    }
  }, [router, saving, text, toast])

  useEffect(() => {
    const openFromEvent = () => openCapture()
    const openFromHash = () => {
      if (window.location.hash !== "#new-idea") return
      openCapture()
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      )
    }

    const frame = window.requestAnimationFrame(openFromHash)
    window.addEventListener(IDEA_CAPTURE_OPEN_EVENT, openFromEvent)
    window.addEventListener("hashchange", openFromHash)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener(IDEA_CAPTURE_OPEN_EVENT, openFromEvent)
      window.removeEventListener("hashchange", openFromHash)
    }
  }, [openCapture])

  const value = useMemo(
    () => ({
      open,
      text,
      error,
      saving,
      discardOpen,
      setText,
      openCapture,
      requestClose,
      confirmDiscard,
      cancelDiscard,
      save,
      isDirty,
    }),
    [
      open,
      text,
      error,
      saving,
      discardOpen,
      setText,
      openCapture,
      requestClose,
      confirmDiscard,
      cancelDiscard,
      save,
      isDirty,
    ],
  )

  return (
    <IdeaCaptureContext.Provider value={value}>
      {children}
    </IdeaCaptureContext.Provider>
  )
}

export function useIdeaCapture() {
  const context = useContext(IdeaCaptureContext)
  if (!context) {
    throw new Error("useIdeaCapture must be used within IdeaCaptureProvider")
  }
  return context
}
