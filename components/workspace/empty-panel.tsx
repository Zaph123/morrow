import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyPanelProps = {
  title: string
  body: string
  action?:
    | { type: "link"; href: string; label: string }
    | { type: "button"; label: string; onClick: () => void }
  className?: string
}

export function EmptyPanel({ title, body, action, className }: EmptyPanelProps) {
  return (
    <section
      className={cn(
        "border-t border-border py-6 text-card-foreground",
        className
      )}
    >
      <h2 className="font-heading text-lg font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action?.type === "link" ? (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "default" }), "mt-5")}
        >
          {action.label}
        </Link>
      ) : null}
      {action?.type === "button" ? (
        <Button type="button" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </section>
  )
}
