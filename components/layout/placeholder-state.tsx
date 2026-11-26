import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlaceholderLinkAction = {
  href: string
  label: string
}

type PlaceholderButtonAction = {
  label: string
  onClick: () => void
}

type PlaceholderAction = PlaceholderLinkAction | PlaceholderButtonAction

type PlaceholderStateProps = {
  title: string
  body: string
  note?: string
  action?: PlaceholderAction
  className?: string
}

export function PlaceholderState({
  title,
  body,
  note,
  action,
  className,
}: PlaceholderStateProps) {
  const actionClassName = cn(buttonVariants({ variant: "outline" }), "mt-5 min-h-11")

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
      {note ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90">
          {note}
        </p>
      ) : null}
      {action ? (
        "href" in action ? (
          <Link href={action.href} className={actionClassName}>
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={actionClassName}>
            {action.label}
          </button>
        )
      ) : null}
    </section>
  )
}
