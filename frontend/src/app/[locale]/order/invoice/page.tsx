import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { InvoiceView } from "@/components/storefront/invoice-view";

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  return { title: t("invoice"), robots: "noindex" };
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-6 py-16 text-center">Loading...</div>}>
      <InvoiceView />
    </Suspense>
  );
}
