import { cn } from "@/lib/utils"

export type SaveStatusKind = "idle" | "dirty" | "saving" | "saved" | "error"

type SaveStatusProps = {
  status: SaveStatusKind
  error?: string | null
  className?: string
}

const LABELS: Record<Exclude<SaveStatusKind, "error">, string> = {
  idle: "Saved on this device",
  dirty: "Unsaved changes",
  saving: "Saving…",
  saved: "Saved on this device",
}

export function SaveStatus({ status, error, className }: SaveStatusProps) {
  const message =
    status === "error"
      ? error || "Could not save. Your latest changes are still on this page."
      : LABELS[status]

  return (
    <p
      className={cn(
        "text-xs leading-relaxed",
        status === "error" ? "text-destructive" : "text-muted-foreground",
        className
      )}
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
        {message}{status === "error" ? " Keep or copy your current text before leaving, then retry saving." : ""}
    </p>
  )
}
