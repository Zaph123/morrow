import { WorkspaceList, WorkspaceListRow } from "@/components/layout/workspace-list"
import { formatRelativeTime } from "@/lib/format"
import { previewText } from "@/lib/workspace/title"
import {
  PLATFORM_LABELS,
  type ContentItem,
  type Idea,
} from "@/lib/workspace/types"

type ContentListProps = {
  items: ContentItem[]
  ideasById: Record<string, Idea>
}

export function ContentList({ items, ideasById }: ContentListProps) {
  return (
    <WorkspaceList>
      {items.map((item) => {
        const source = item.sourceIdeaId
          ? ideasById[item.sourceIdeaId]
          : undefined
        const sourceLabel = item.sourceIdeaId
          ? source
            ? "From an idea"
            : "Source idea unavailable"
          : "Started from scratch"

        return (
          <WorkspaceListRow
            key={item.id}
            href={`/content/${item.id}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-heading text-base font-medium tracking-tight text-foreground">
                {item.title || "Untitled draft"}
              </h3>
              <span className="text-xs text-muted-foreground">Draft</span>
            </div>
            {item.body ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {previewText(item.body, 140)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No body yet</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Updated {formatRelativeTime(item.updatedAt)}</span>
              <span>
                {item.platform
                  ? PLATFORM_LABELS[item.platform]
                  : "No platform set"}
              </span>
              <span>{sourceLabel}</span>
            </div>
          </WorkspaceListRow>
        )
      })}
    </WorkspaceList>
  )
}
