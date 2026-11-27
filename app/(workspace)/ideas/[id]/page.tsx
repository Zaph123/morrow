import type { Metadata } from "next"
import { Suspense } from "react"

import { IdeaDetailLoading } from "@/components/layout/loading-skeletons"
import { IdeaDetail } from "@/components/ideas/idea-detail"

export const metadata: Metadata = {
  title: "Idea",
}

type IdeaPageProps = {
  params: Promise<{ id: string }>
}

async function IdeaDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <IdeaDetail ideaId={id} />
}

export default function IdeaPage({ params }: IdeaPageProps) {
  return (
    <Suspense
      fallback={<IdeaDetailLoading />}
    >
      <IdeaDetailRoute params={params} />
    </Suspense>
  )
}
