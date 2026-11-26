/** Derive a short display title from freeform body text. */
export function deriveTitle(body: string, fallback = "Untitled draft"): string {
  const normalized = body.replace(/\s+/g, " ").trim()
  if (!normalized) return fallback
  const firstLine = normalized.split(/\n/)[0]?.trim() ?? normalized
  if (firstLine.length <= 72) return firstLine
  return `${firstLine.slice(0, 69).trimEnd()}…`
}

export function previewText(body: string, max = 140): string {
  const normalized = body.replace(/\s+/g, " ").trim()
  if (!normalized) return ""
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}
