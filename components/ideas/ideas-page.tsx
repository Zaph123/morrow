"use client"

import { CollectionLoading } from "@/components/layout/loading-skeletons"

import { useState, useEffect } from "react"
import { ChevronRight, Plus, Search } from "lucide-react"

import {
  IDEAS_CHANGED_EVENT,
  useIdeaCapture,
} from "@/components/ideas/idea-capture-context"
import { PlaceholderState } from "@/components/layout/placeholder-state"
import {
  WorkspaceList,
  WorkspaceListRow,
} from "@/components/layout/workspace-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SegmentedControl from "@/components/arc/segmented-control/segmented-control"
import { getIdeas, getContentItems } from "@/lib/storage"
import { formatDate } from "@/lib/format"
import type { Idea, ContentItem } from "@/types"

export function IdeasPage() {
  const { openCapture } = useIdeaCapture()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [mounted, setMounted] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const visibleIdeas = ideas.filter(
    (idea) =>
      idea.text
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()) &&
      (filter === "all" ||
        !content.some((item) => item.sourceIdeaId === idea.id)),
  )
  const successfullyEmpty = mounted && !loadError && ideas.length === 0

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (active) loadIdeas()
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const refresh = () => loadIdeas()
    window.addEventListener(IDEAS_CHANGED_EVENT, refresh)
    return () => window.removeEventListener(IDEAS_CHANGED_EVENT, refresh)
  }, [])

  function loadIdeas() {
    try {
      const loaded = getIdeas()
      const writing = getContentItems()
      setIdeas(loaded)
      setContent(writing)
      setLoadError(null)
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load saved ideas.",
      )
    } finally {
      setMounted(true)
    }
  }

  return (
    <div className="collection-page">
      <header className="collection-heading">
        <h1>Ideas</h1>
        <Button
          type="button"
          variant={successfullyEmpty ? "ghost" : "secondary"}
          size="icon"
          className="collection-mobile-action md:hidden"
          aria-label="New idea"
          onClick={openCapture}
        >
          <Plus aria-hidden="true" />
        </Button>
      </header>

      {!successfullyEmpty && (
        <div className="collection-tools">
          <label className="collection-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search ideas</span>
            <Input
              type="search"
              placeholder="Search ideas"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <SegmentedControl
            label="Filter ideas"
            className="collection-filter-segmented"
            fullWidth
            value={filter}
            onValueChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "undeveloped", label: "Not developed" },
            ]}
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {!mounted ? (
          <CollectionLoading label="Loading ideas" />
        ) : loadError ? (
          <section className="collection-state">
            <h2>Couldn’t load ideas</h2>
            <p className="text-sm text-destructive" role="alert">
              {loadError}
            </p>
            <Button variant="secondary" className="mt-3" onClick={loadIdeas}>
              Try again
            </Button>
          </section>
        ) : successfullyEmpty ? (
          <PlaceholderState
            title="No ideas yet"
            body="Save a thought now. You can develop it later."
            className="collection-state collection-empty ideas-empty"
            action={{ label: "New idea", onClick: openCapture }}
          />
        ) : visibleIdeas.length === 0 ? (
          <section className="collection-state">
            <h2>No ideas found</h2>
            <p>Try a different search or show all ideas.</p>
            <Button
              variant="secondary"
              className="mt-4 min-h-11"
              onClick={() => {
                setQuery("")
                setFilter("all")
              }}
            >
              Clear filters
            </Button>
          </section>
        ) : (
          <section aria-labelledby="ideas-list-heading">
            <h2 id="ideas-list-heading" className="sr-only">
              Saved ideas
            </h2>
            <WorkspaceList className="collection-list">
              {visibleIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  relatedCount={
                    content.filter((item) => item.sourceIdeaId === idea.id)
                      .length
                  }
                />
              ))}
            </WorkspaceList>
          </section>
        )}
      </div>
    </div>
  )
}

function IdeaCard({
  idea,
  relatedCount,
}: {
  idea: Idea
  relatedCount: number
}) {
  return (
    <WorkspaceListRow href={`/ideas/${idea.id}`} className="collection-row">
      <div className="min-w-0">
        <h3 className="collection-row-title">
          {idea.text.split("\n")[0] || idea.text}
        </h3>
        {idea.text.includes("\n") && (
          <p className="collection-preview">
            {idea.text.slice(idea.text.indexOf("\n") + 1).trim()}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={idea.createdAt}>{formatDate(idea.createdAt)}</time>
          {relatedCount > 0 && (
            <span>
              {relatedCount} {relatedCount === 1 ? "draft" : "drafts"}
            </span>
          )}
          {relatedCount === 0 && <span>Not developed yet</span>}
        </div>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
    </WorkspaceListRow>
  )
}
