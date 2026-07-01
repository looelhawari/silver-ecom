import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { OrderSuccessView } from "@/components/storefront/order-success-view";

export const metadata = { title: "Order confirmed" };

export default function OrderSuccessPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading…</div>}>
        <OrderSuccessView />
      </Suspense>
    </StorefrontShell>
  );
}
