import type { Metadata } from "next"
import { Suspense } from "react"

import { ContentEditor } from "@/components/content/content-editor"

export const metadata: Metadata = {
  title: "Draft",
}

type ContentDetailPageProps = {
  params: Promise<{ id: string }>
}

async function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ContentEditor mode={{ kind: "edit", contentId: id }} />
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground" role="status">
          Loading draft…
        </p>
      }
    >
      <ContentDetail params={params} />
    </Suspense>
  )
}
