import type { Metadata } from "next"
import { Suspense } from "react"

import { ContentEditor } from "@/components/content/content-editor"
import { StudioEditorSkeleton } from "@/components/studio/writing-surface"

export const metadata: Metadata = {
  title: "New draft",
}

type NewContentPageProps = {
  searchParams: Promise<{ from?: string }>
}

async function NewContent({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const sourceIdeaId = typeof from === "string" && from.length > 0 ? from : null

  return <ContentEditor mode={{ kind: "create", sourceIdeaId }} />
}

export default function NewContentPage({ searchParams }: NewContentPageProps) {
  return (
    <Suspense
      fallback={<StudioEditorSkeleton label="Loading draft editor" />}
    >
      <NewContent searchParams={searchParams} />
    </Suspense>
  )
}
