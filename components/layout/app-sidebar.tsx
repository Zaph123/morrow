"use client"

import { useSyncExternalStore } from "react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

import { NavLink } from "@/components/layout/nav-link"
import { NewIdeaLink } from "@/components/ideas/new-idea-link"
import { Button } from "@/components/ui/button"
import { primaryNav, settingsNav } from "@/lib/navigation"
import {
  readSidebarCollapsed,
  subscribeSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/ui-preferences"
import { cn } from "@/lib/utils"

const subscribeNever = () => () => {}
const getClientReady = () => true
const getServerReady = () => false

export function AppSidebar() {
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    readSidebarCollapsed,
    () => false,
  )
  const ready = useSyncExternalStore(subscribeNever, getClientReady, getServerReady)

  function toggleCollapsed() {
    const next = !collapsed
    writeSidebarCollapsed(next)
  }

  return (
    <aside
      className={cn(
        "app-sidebar sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-6 text-sidebar-foreground md:flex",
        collapsed ? "app-sidebar-collapsed px-3" : "px-6",
        ready && "app-sidebar-ready",
      )}
      aria-label="Primary"
      data-collapsed={collapsed ? "true" : "false"}
    >
      <button
        type="button"
        className="sidebar-edge-rail"
        data-sidebar-edge-rail
        tabIndex={-1}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleCollapsed}
      />
      <div
        className={cn(
          "flex items-center gap-2 pb-8",
          collapsed ? "flex-col" : "flex-row",
        )}
      >
        <NewIdeaLink
          collapsed={collapsed}
          className={!collapsed ? "min-w-0 flex-1" : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="sidebar-collapse-toggle relative size-11 shrink-0 text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-describedby="sidebar-toggle-tooltip"
          aria-expanded={!collapsed}
          aria-controls="workspace-nav"
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" aria-hidden />
          ) : (
            <ChevronsLeft className="size-4" aria-hidden />
          )}
          <span id="sidebar-toggle-tooltip" className="sidebar-tooltip" role="tooltip">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>

      <nav
        id="workspace-nav"
        className="flex flex-1 flex-col gap-1"
        aria-label="Workspace"
      >
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div>
        <NavLink item={settingsNav} collapsed={collapsed} />
      </div>
    </aside>
  )
}
