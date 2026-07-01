import { Suspense } from "react";

import { InvoiceView } from "@/components/storefront/invoice-view";

export const metadata = { title: "Invoice", robots: "noindex" };

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-6 py-16 text-center">Loading…</div>}>
      <InvoiceView />
    </Suspense>
  );
}
