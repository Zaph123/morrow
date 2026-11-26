import type { ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type WorkspaceListProps = {
  children: ReactNode
  className?: string
}

type WorkspaceListRowProps = {
  href: string
  children: ReactNode
  className?: string
}

export function WorkspaceList({ children, className }: WorkspaceListProps) {
  return (
    <ul className={cn("divide-y divide-border border-y border-border", className)}>
      {children}
    </ul>
  )
}

export function WorkspaceListRow({
  href,
  children,
  className,
}: WorkspaceListRowProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "workspace-list-row block px-3 py-4 outline-none transition-colors duration-120 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none",
          className
        )}
      >
        {children}
      </Link>
    </li>
  )
}
