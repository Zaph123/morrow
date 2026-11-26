"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  applyThemePreference,
  isThemePreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme"

type ThemeContextValue = {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange)
    window.addEventListener("morrow-theme-change", onChange)
    return () => {
      window.removeEventListener("storage", onChange)
      window.removeEventListener("morrow-theme-change", onChange)
    }
  }, [])
  const getSnapshot = useCallback((): ThemePreference => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      return isThemePreference(stored) ? stored : "system"
    } catch {
      return "system"
    }
  }, [])
  const getServerSnapshot = useCallback((): ThemePreference => "system", [])
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  useEffect(() => {
    applyThemePreference(preference)
  }, [preference])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (preference === "system") applyThemePreference("system")
    }

    media.addEventListener("change", handleSystemThemeChange)
    return () => media.removeEventListener("change", handleSystemThemeChange)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Keep the selected theme in memory if storage is unavailable.
    }
    applyThemePreference(next)
    window.dispatchEvent(new Event("morrow-theme-change"))
  }, [])

  const value = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemePreference() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error("useThemePreference must be used inside ThemeProvider")
  }
  return value
}
