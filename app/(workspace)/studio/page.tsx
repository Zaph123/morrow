import type { Metadata } from "next";
import { Suspense } from "react";

import { StudioPage } from "@/components/studio/studio-page";

export const metadata: Metadata = {
  title: "Studio",
};

export default function StudioPageRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        </div>
      }
    >
      <StudioPage />
    </Suspense>
  );
}
