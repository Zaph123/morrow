"use client";

import { CollectionLoading } from "@/components/layout/loading-skeletons";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search } from "lucide-react";

import { PlaceholderState } from "@/components/layout/placeholder-state";
import { WorkspaceList, WorkspaceListRow } from "@/components/layout/workspace-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SegmentedControl from "@/components/arc/segmented-control/segmented-control";
import { cn } from "@/lib/utils";
import { getContentItems, getIdeas } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import type { ContentItem, Idea } from "@/types";

export function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const visibleContent = content.filter(item =>
    `${item.title} ${item.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
    (filter === "all" || item.status === filter)
  );
  const successfullyEmpty = mounted && !loadError && content.length === 0;

  function loadContent() {
    try {
      const loaded = getContentItems();
      const sources = getIdeas();
      setContent(loaded);
      setIdeas(sources);
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load saved content.");
    } finally {
      setMounted(true);
    }
  }

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) loadContent(); });
    return () => { active = false; };
  }, []);

  return (
    <div className="collection-page">
      <header className="collection-heading">
        <h1>Library</h1>
          <NewDraftAction />
      </header>
      {!successfullyEmpty && (
        <div className="collection-tools">
          <label className="collection-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search writing</span>
            <Input type="search" placeholder="Search writing" value={query} onChange={e => setQuery(e.target.value)} />
          </label>
          <SegmentedControl
            label="Filter writing"
            className="collection-filter-segmented"
            fullWidth
            value={filter}
            onValueChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "draft", label: "Drafts" },
              { value: "ready", label: "Ready" },
              { value: "published", label: "Published" },
            ]}
          />
        </div>
      )}

      <div>
        {!mounted ? (
          <CollectionLoading label="Loading writing" kind="writing" />
        ) : loadError ? (
          <section className="collection-state">
            <h2>Couldn’t load writing</h2>
            <p className="text-sm text-destructive" role="alert">{loadError}</p>
            <Button variant="secondary" className="mt-3" onClick={loadContent}>Try again</Button>
          </section>
        ) : successfullyEmpty ? (
          <PlaceholderState
            title="No writing yet"
            body="Your drafts and published writing will appear here."
            className="collection-state collection-empty library-empty"
            action={{ href: "/studio", label: "Open Studio" }}
          />
        ) : visibleContent.length === 0 ? (
          <section className="collection-state">
            <h2>No writing found</h2>
            <p>Try a different search or show all writing.</p>
            <Button variant="secondary" className="mt-4 min-h-11" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button>
          </section>
        ) : (
          <section aria-labelledby="content-list-heading">
            <h2 id="content-list-heading" className="sr-only">
              Saved content
            </h2>
            <WorkspaceList className="collection-list">
              {visibleContent.map((item) => (
                <ContentCard key={item.id} item={item} sourceIdea={ideas.find((idea) => idea.id === item.sourceIdeaId) ?? null} />
              ))}
            </WorkspaceList>
          </section>
        )}
      </div>
    </div>
  );
}

function NewDraftAction() {
  return (
    <Link
      href="/studio/new"
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "collection-mobile-action md:hidden"
      )}
      aria-label="New draft"
    >
      <Plus aria-hidden="true" />
      <span className="sr-only">New draft</span>
    </Link>
  )
}

function ContentCard({ item, sourceIdea }: { item: ContentItem; sourceIdea: Idea | null }) {
  return (
    <WorkspaceListRow href={`/studio?contentId=${item.id}`} className="collection-row">
        <div className="min-w-0 flex-1">
          <h3 className="collection-row-title">
            {item.title || "Untitled"}
          </h3>
          <p className="collection-preview">
            {item.body}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
            {item.platform && (
              <span className="capitalize">{item.platform.replace("-", " ")}</span>
            )}
            {sourceIdea && (
              <span>From idea</span>
            )}
            {item.sourceIdeaId && !sourceIdea && <span>Source idea unavailable</span>}
            <span className="capitalize">{item.status}</span>
          </div>
        </div>
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    </WorkspaceListRow>
  );
}
