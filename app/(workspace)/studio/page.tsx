import type { Metadata } from "next";
import { Suspense } from "react";

import { StudioPage } from "@/components/studio/studio-page";
import { StudioStartSkeleton } from "@/components/studio/studio-start-page";

export const metadata: Metadata = {
  title: "Studio",
};

export default function StudioPageRoute() {
  return (
    <div className="studio-route">
      <Suspense fallback={<StudioStartSkeleton />}>
        <StudioPage />
      </Suspense>
    </div>
  );
}
