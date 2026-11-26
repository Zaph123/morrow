"use client"

import { useCallback, useSyncExternalStore, type ComponentProps, type ReactNode } from "react"

import { BottomSheet } from "@/components/arc/bottom-sheet/bottom-sheet"
import { Dialog, DialogContent } from "@/components/arc/dialog/dialog"

const DESKTOP_QUERY = "(min-width: 768px), (hover: hover) and (pointer: fine)"
const SHORT_VIEWPORT_QUERY = "(max-height: 600px)"

type OutsideEvent = Parameters<NonNullable<ComponentProps<typeof DialogContent>["onPointerDownOutside"]>>[0]
type EscapeEvent = Parameters<NonNullable<ComponentProps<typeof DialogContent>["onEscapeKeyDown"]>>[0]

function useMediaQuery(query: string, serverSnapshot: boolean) {
  return useSyncExternalStore(
    useCallback(
      (onChange) => {
        const media = window.matchMedia(query)
        media.addEventListener("change", onChange)
        return () => media.removeEventListener("change", onChange)
      },
      [query],
    ),
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  )
}

export type ResponsiveDialogDrawerProps = {
  open: boolean
  onRequestClose: () => boolean
  title: string
  description?: string
  dialogClassName?: string
  sheetClassName?: string
  /** When true, Escape and outside press do not dismiss this surface (e.g. nested confirm open). */
  dismissLocked?: boolean
  onPointerDownOutside?: (event: OutsideEvent) => void
  children: ReactNode
}

/** Dialog on desktop, bottom sheet on mobile. Content and feature state stay with the caller. */
export function ResponsiveDialogDrawer({
  open,
  onRequestClose,
  title,
  description,
  dialogClassName,
  sheetClassName,
  dismissLocked = false,
  onPointerDownOutside,
  children,
}: ResponsiveDialogDrawerProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true)
  const isShortViewport = useMediaQuery(SHORT_VIEWPORT_QUERY, false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !dismissLocked) onRequestClose()
  }

  const handleEscapeKeyDown = useCallback(
    (event: EscapeEvent) => {
      event.preventDefault()
      if (dismissLocked) return
      onRequestClose()
    },
    [dismissLocked, onRequestClose],
  )

  const handlePointerDownOutside = useCallback(
    (event: OutsideEvent) => {
      if (dismissLocked) event.preventDefault()
      onPointerDownOutside?.(event)
    },
    [dismissLocked, onPointerDownOutside],
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          title={title}
          description={description}
          className={dialogClassName}
          onPointerDownOutside={handlePointerDownOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
        >
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      onDismissRequest={() => {
        if (dismissLocked) return false
        return onRequestClose()
      }}
      onPointerDownOutside={handlePointerDownOutside}
      title={title}
      description={description}
      detents={[0.52, 0.92]}
      initialDetent={isShortViewport ? 1 : 0}
      className={sheetClassName}
    >
      {children}
    </BottomSheet>
  )
}
