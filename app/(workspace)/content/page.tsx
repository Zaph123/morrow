import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Content",
};

export default function ContentPageRoute() {
  return <ContentPage />;
}
