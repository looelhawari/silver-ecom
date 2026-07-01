import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { CustomOrderStory } from "@/components/home/custom-order-story";
import { FAQPreview } from "@/components/home/faq-preview";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FinalCTA } from "@/components/home/final-cta";
import { HeroSection } from "@/components/home/hero-section";
import { Marquee } from "@/components/home/marquee";
import { OrderTrackingPreview } from "@/components/home/order-tracking-preview";
import { PaymentTrustSection } from "@/components/home/payment-trust";
import { PricingTransparency } from "@/components/home/pricing-transparency";
import { ReviewSection } from "@/components/home/review-section";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { SignatureCollections } from "@/components/home/signature-collections";
import { SocialShowcase } from "@/components/home/social-showcase";
import { TrustStrip } from "@/components/home/trust-strip";
import { WhyBuyFromUs } from "@/components/home/why-buy";
import { apiFetch } from "@/lib/api";
import type { ProductListItem } from "@/types/catalog";

type HomeData = {
  featured_products: ProductListItem[];
  new_arrivals: ProductListItem[];
  best_sellers: ProductListItem[];
};

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    title: { absolute: t("homeTitle") },
    description: t("homeDescription"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
    },
  };
}

async function getHome(locale: string): Promise<HomeData> {
  try {
    const res = await apiFetch<{ data: HomeData }>("/home", { cache: "no-store", locale });
    return res.data;
  } catch {
    return { featured_products: [], new_arrivals: [], best_sellers: [] };
  }
}

export default async function Home({ params }: { params: PageParams }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage" });
  const data = await getHome(locale);

  const groups = [
    { key: "best", label: t("groups.best"), products: data.best_sellers ?? [] },
    { key: "new", label: t("groups.new"), products: data.new_arrivals ?? [] },
    { key: "featured", label: t("groups.featured"), products: data.featured_products ?? [] },
  ];

  const marqueeItems = t.raw("marquee") as string[];

  return (
    <StorefrontShell>
      <ScrollProgress />
      <HeroSection />
      <Marquee items={marqueeItems} />
      <TrustStrip />
      <CategoryShowcase />
      <SignatureCollections />
      <FeaturedProducts groups={groups} />
      <CustomOrderStory />
      <PricingTransparency />
      <WhyBuyFromUs />
      <OrderTrackingPreview />
      <PaymentTrustSection />
      <ReviewSection />
      <SocialShowcase />
      <FAQPreview />
      <FinalCTA />
    </StorefrontShell>
  );
}
