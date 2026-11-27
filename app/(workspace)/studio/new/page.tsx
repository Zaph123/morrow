import type { Metadata } from "next"
import { Suspense } from "react"

import { StudioPage } from "@/components/studio/studio-page"
import { StudioEditorSkeleton } from "@/components/studio/writing-surface"

export const metadata: Metadata = { title: "New draft · Studio" }

export default function NewStudioDraftRoute() {
  return (
    <div className="studio-route">
      <Suspense fallback={<StudioEditorSkeleton />}>
        <StudioPage newDraft />
      </Suspense>
    </div>
  )
}
