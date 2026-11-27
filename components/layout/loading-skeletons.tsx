import Link from "next/link"

/** Decorative shapes reuse the collection's existing neutral skeleton role. */
export function CollectionLoading({ label, kind = "ideas" }: { label: string; kind?: "ideas" | "writing" }) {
  return (
    <>
      <span className="sr-only" role="status">{label}</span>
      <section aria-busy="true">
        <div className="collection-loading" data-kind={kind} aria-hidden="true">
          {[0, 1, 2, 3].map((row) => (
            <div className="collection-loading-row" key={row}>
              <div className="collection-loading-title"><div className="collection-skeleton" /></div>
              {(kind === "writing" || row === 0 || row === 3) && (
                <div className="collection-loading-preview">
                  <div className="collection-skeleton" />
                  {kind === "writing" && <div className="collection-skeleton" />}
                </div>
              )}
              <div className="collection-loading-meta"><div className="collection-skeleton" /></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export function IdeaDetailLoading() {
  return (
    <div className="idea-detail-page">
      <span className="sr-only" role="status">Loading idea</span>
      <div aria-busy="true">
      <header className="idea-detail-toolbar">
        <Link href="/ideas" className="text-sm text-muted-foreground">Ideas</Link>
      </header>
      <section className="idea-original idea-loading" aria-hidden="true">
        <div className="collection-skeleton skeleton-title" />
        <div className="collection-skeleton skeleton-preview" />
        <div className="collection-skeleton skeleton-preview" />
        <div className="collection-skeleton skeleton-meta" />
      </section>
      </div>
    </div>
  )
}
