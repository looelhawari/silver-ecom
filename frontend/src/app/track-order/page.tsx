import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { TrackOrderView } from "@/components/storefront/track-order-view";

export const metadata = {
  title: "Track your order",
  description: "Track your Fidda Silver order with your order code and phone number.",
};

export default function TrackOrderPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading…</div>}>
        <TrackOrderView />
      </Suspense>
    </StorefrontShell>
  );
}
