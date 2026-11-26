"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useId } from "react"
import { LibraryIcon, navIcons } from "@/components/layout/nav-icons"
import { cn } from "@/lib/utils"
import { isNavActive, type NavItem } from "@/lib/navigation"

type NavLinkProps = {
  item: NavItem
  variant?: "sidebar" | "mobile" | "sheet"
  collapsed?: boolean
  onNavigate?: () => void
}

export function NavLink({
  item,
  variant = "sidebar",
  collapsed = false,
  onNavigate,
}: NavLinkProps) {
  const tooltipId = useId()
  const pathname = usePathname()
  const active = isNavActive(pathname, item.href)
  const selected =
    active ||
    (variant === "mobile" && pathname === "/settings" && item.icon === "brand-brain")
  const Icon =
    variant !== "mobile" && item.icon === "content"
      ? LibraryIcon
      : navIcons[item.icon]
  const showLabel =
    variant === "mobile" ? selected : !collapsed

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-describedby={collapsed && variant === "sidebar" ? tooltipId : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-xl text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "mobile"
          ? "min-w-11 justify-center gap-2 rounded-full px-2 focus-visible:ring-offset-(--mobile-nav)"
          : cn(
              "px-3 text-[15px] leading-5 focus-visible:ring-offset-sidebar",
              collapsed && "justify-center px-0",
            ),
        variant === "mobile"
          ? selected
            ? "bg-(--mobile-selection) text-white"
            : "text-white/80 hover:text-white"
          : active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {showLabel ? (
        <span>
          {variant === "mobile" && item.icon === "brand-brain"
            ? "Brain"
            : item.label}
        </span>
      ) : null}
      {collapsed && variant === "sidebar" ? (
        <span id={tooltipId} className="sidebar-tooltip" role="tooltip">
          {item.label}
        </span>
      ) : null}
    </Link>
  )
}
