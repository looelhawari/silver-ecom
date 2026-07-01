import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CmsPage } from "@/components/storefront/cms-page";

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies" });
  return { title: t("silverCare") };
}

export default function SilverCarePage() {
  return <CmsPage slug="silver-care" />;
}
