"use client"

import { useId } from "react"

import { THEME_PREFERENCES } from "@/lib/theme"
import { useThemePreference } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

type ThemeSelectProps = {
  compact?: boolean
}

const LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const

export function ThemeSelect({ compact = false }: ThemeSelectProps) {
  const id = useId()
  const { preference, setPreference } = useThemePreference()

  return (
    <div className={cn("grid gap-1.5", compact && "block")}>
      {!compact ? (
        <label
          htmlFor={id}
          className="px-1 text-xs font-medium text-muted-foreground"
        >
          Appearance
        </label>
      ) : null}
      <select
        id={id}
        data-slot="theme-select"
        aria-label={compact ? "Color theme" : undefined}
        value={preference}
        onChange={(event) =>
          setPreference(event.target.value as (typeof THEME_PREFERENCES)[number])
        }
        className={cn(
          "h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          compact && "h-9 w-28 px-2.5"
        )}
      >
        {THEME_PREFERENCES.map((option) => (
          <option key={option} value={option}>
            {LABELS[option]}
          </option>
        ))}
      </select>
    </div>
  )
}
