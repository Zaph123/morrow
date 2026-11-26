"use client"

import { Plus } from "lucide-react"
import { useId } from "react"

import { useIdeaCapture } from "@/components/ideas/idea-capture-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NewIdeaLinkProps = {
  collapsed?: boolean
  className?: string
}

/** Opens the shared capture controller without changing the current route. */
export function NewIdeaLink({ collapsed = false, className }: NewIdeaLinkProps) {
  const tooltipId = useId()
  const { openCapture } = useIdeaCapture()

  return (
    <Button
      type="button"
      variant="secondary"
      size={collapsed ? "icon" : "lg"}
      className={cn(
        collapsed ? "size-11 shrink-0" : "w-full text-[15px] leading-5",
        collapsed && "sidebar-new-idea relative",
        className,
      )}
      aria-label="New idea"
      aria-describedby={collapsed ? tooltipId : undefined}
      onClick={openCapture}
    >
      <Plus className="size-4.5" aria-hidden />
      {collapsed ? null : <span>New idea</span>}
      {collapsed ? (
        <span id={tooltipId} className="sidebar-tooltip" role="tooltip">
          New idea
        </span>
      ) : null}
    </Button>
  )
}
