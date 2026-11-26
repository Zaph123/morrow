import { WorkspaceList, WorkspaceListRow } from "@/components/layout/workspace-list"
import { formatRelativeTime } from "@/lib/format"
import { previewText } from "@/lib/workspace/title"
import type { ContentItem, Idea } from "@/lib/workspace/types"

type IdeaListProps = {
  ideas: Idea[]
  relatedCounts: Record<string, number>
}

export function IdeaList({ ideas, relatedCounts }: IdeaListProps) {
  return (
    <WorkspaceList>
      {ideas.map((idea) => {
        const related = relatedCounts[idea.id] ?? 0
        return (
          <WorkspaceListRow
            key={idea.id}
            href={`/ideas/${idea.id}`}
          >
            <p className="text-sm leading-relaxed text-foreground">
              {previewText(idea.body, 160) || "Empty idea"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Updated {formatRelativeTime(idea.updatedAt)}</span>
              <span>
                {related === 0
                  ? "No related drafts"
                  : related === 1
                    ? "1 related draft"
                    : `${related} related drafts`}
              </span>
            </div>
          </WorkspaceListRow>
        )
      })}
    </WorkspaceList>
  )
}

export function countRelatedByIdea(content: ContentItem[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of content) {
    if (!item.sourceIdeaId) continue
    counts[item.sourceIdeaId] = (counts[item.sourceIdeaId] ?? 0) + 1
  }
  return counts
}
