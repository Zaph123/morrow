import type { Metadata } from "next"

import { PageHeader } from "@/components/layout/page-header"
import { PlaceholderState } from "@/components/layout/placeholder-state"

export const metadata: Metadata = {
  title: "Calendar",
}

export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Plan what comes next"
        description="Internal scheduling for when you intend to publish—separate from posting on external platforms."
      />

      <PlaceholderState
        title="No plans yet"
        body="Upcoming posts and reminders will appear here once scheduling is built. A date in Morrow does not mean a social network has published anything."
        note="Manual publishing remains the workflow for the initial version."
      />
    </div>
  )
}
