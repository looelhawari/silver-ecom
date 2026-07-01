import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { CustomTrackView } from "@/components/storefront/custom-track-view";

export const metadata = { title: "Track custom request" };

export default function TrackCustomPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading…</div>}>
        <CustomTrackView />
      </Suspense>
    </StorefrontShell>
  );
}
