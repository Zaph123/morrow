/** Stable client-side ids. Prefer crypto.randomUUID when available. */
export function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }
  return `morrow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
