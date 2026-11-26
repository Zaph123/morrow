import { Suspense } from "react"

import { IdeaCaptureProvider } from "@/components/ideas/idea-capture-context"
import { IdeaCaptureDialog } from "@/components/ideas/idea-capture-dialog"
import { ToastStack, ToastStackProvider } from "@/components/arc/toast-stack/toast-stack"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  MobileBottomNav,
  MobileTopBar,
} from "@/components/layout/mobile-nav"

function SidebarFallback() {
  return (
    <aside
      className="app-sidebar hidden shrink-0 border-r border-sidebar-border bg-sidebar md:block"
      aria-hidden
    />
  )
}

function MobileNavFallback() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-border bg-background md:hidden"
      aria-hidden
    />
  )
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastStackProvider>
      <IdeaCaptureProvider>
        <div className="flex min-h-full flex-1 bg-background text-foreground">
          <Suspense fallback={<SidebarFallback />}>
            <AppSidebar />
          </Suspense>
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileTopBar />
            <main
              id="main-content"
              className="flex-1 overflow-y-auto px-6 pb-[calc(112px+env(safe-area-inset-bottom))] pt-6 md:px-10 md:pb-10 md:pt-12"
            >
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
            <Suspense fallback={<MobileNavFallback />}>
              <MobileBottomNav />
            </Suspense>
          </div>
        </div>
        <IdeaCaptureDialog />
      </IdeaCaptureProvider>
      <ToastStack position="bottom-right" className="morrow-toast-viewport" />
    </ToastStackProvider>
  )
}
