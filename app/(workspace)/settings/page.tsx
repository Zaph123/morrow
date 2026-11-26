import type { Metadata } from "next"

import { PageHeader } from "@/components/layout/page-header"
import { PlaceholderState } from "@/components/layout/placeholder-state"

export const metadata: Metadata = {
  title: "You",
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="You"
        description="Account controls, provider configuration, and export options will live here when those integrations exist."
      />

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Appearance: Light.</p>
        <PlaceholderState
          title="Integrations not configured"
          body="Authentication, database, and AI provider settings are not available in this build. Controls that would imply a live connection are intentionally omitted."
          note="Environment variables and Supabase setup remain pending—see the README and architecture docs."
        />

        <PlaceholderState
          title="Data ownership"
          body="Export and backup will be added so your ideas, content, and Brand Brain stay portable. Reliable saving comes before sophisticated recovery tools."
        />
      </div>
    </div>
  )
}
