export const THEME_STORAGE_KEY = "morrow.theme"

export const THEME_PREFERENCES = ["light", "dark", "system"] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = Exclude<ThemePreference, "system">

export function isThemePreference(value: string | null): value is ThemePreference {
  return THEME_PREFERENCES.some((preference) => preference === value)
}

export function applyThemePreference(_preference: ThemePreference) {
  void _preference
  // Temporary effective-Light policy. Reading/applying never rewrites preference.
  const root = document.documentElement
  const resolvedTheme: ResolvedTheme = "light"

  root.dataset.theme = resolvedTheme
  root.classList.remove("dark")
  root.style.colorScheme = resolvedTheme
}

/** First paint agrees with the temporary Light policy, even with blocked storage. */
export const themeBootstrapScript = `(() => {
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.classList.remove("dark");
  root.style.colorScheme = "light";
})();`
