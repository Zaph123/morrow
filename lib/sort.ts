/** Newest first, without mutating the source or reordering equal timestamps. */
export function sortByUpdatedDesc<T extends { updatedAt: string }>(items: readonly T[]): T[] {
  return [...items].sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
  )
}
