/** Separate from theme and workspace data keys. */
export const SIDEBAR_COLLAPSED_KEY = "morrow.ui.sidebar-collapsed"
export const SIDEBAR_COLLAPSED_EVENT = "morrow:sidebar-collapsed-change"

let inMemorySidebarCollapsed: boolean | null = null

export function readSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    return stored === null ? inMemorySidebarCollapsed ?? false : stored === "1"
  } catch {
    return inMemorySidebarCollapsed ?? false
  }
}

export function writeSidebarCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0")
    inMemorySidebarCollapsed = null
  } catch {
    inMemorySidebarCollapsed = collapsed
    // Preference is best-effort; layout still updates in memory.
  }
  document.documentElement.dataset.sidebarCollapsed = collapsed ? "true" : "false"
  window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT))
}

export function subscribeSidebarCollapsed(callback: () => void) {
  window.addEventListener(SIDEBAR_COLLAPSED_EVENT, callback)
  return () => window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, callback)
}

/** First paint matches stored collapse preference to avoid a width jump. */
export const sidebarBootstrapScript = `(() => {
  try {
    const collapsed = localStorage.getItem(${JSON.stringify(SIDEBAR_COLLAPSED_KEY)}) === "1";
    document.documentElement.dataset.sidebarCollapsed = collapsed ? "true" : "false";
  } catch {
    document.documentElement.dataset.sidebarCollapsed = "false";
  }
})();`
