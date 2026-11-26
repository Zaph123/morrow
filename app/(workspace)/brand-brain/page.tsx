import type { Metadata } from "next"

import { PageHeader } from "@/components/layout/page-header"
import { PlaceholderState } from "@/components/layout/placeholder-state"

export const metadata: Metadata = {
  title: "Brand Brain",
}

export default function BrandBrainPage() {
  return (
    <div>
      <PageHeader
        title="Your voice, on record"
        description="Identity, voice, strategy, and approved learning—controlled by you, not silently rewritten by AI."
      />

      <div className="space-y-4">
        <PlaceholderState
          title="Profile not set up"
          body="Brand Brain will hold background, voice preferences, content pillars, and feedback you approve. Nothing is stored here yet."
          note="Ownership: permanent updates will require your approval when personalization ships."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PlaceholderState
            title="Identity"
            body="Background, interests, and goals you choose to share with Morrow."
          />
          <PlaceholderState
            title="Voice"
            body="Tone, style, and examples that keep drafts sounding like you."
          />
        </div>
      </div>
    </div>
  )
}
