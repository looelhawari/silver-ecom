import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { TrackOrderView } from "@/components/storefront/track-order-view";

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("trackOrderTitle"), description: t("trackOrderDescription") };
}

export default function TrackOrderPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading...</div>}>
        <TrackOrderView />
      </Suspense>
    </StorefrontShell>
  );
}
