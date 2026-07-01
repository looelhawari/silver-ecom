import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: { absolute: "Premium Silver Jewelry in Egypt | Custom Silver Orders" },
  description:
    "Shop elegant Egyptian, Italian, Turkish and custom-made silver jewelry with secure ordering, manual payment options, and order tracking across Egypt.",
  openGraph: {
    title: "Premium Silver Jewelry in Egypt | Custom Silver Orders",
    description:
      "Elegant Egyptian, Italian, Turkish and custom-made silver jewelry — secure ordering, manual payments, and tracking across Egypt.",
    type: "website",
  },
};

type HomeData = {
  featured_products: ProductListItem[];
  new_arrivals: ProductListItem[];
  best_sellers: ProductListItem[];
};

async function getHome(): Promise<HomeData> {
  try {
    const res = await apiFetch<{ data: HomeData }>("/home", { cache: "no-store" });
    return res.data;
  } catch {
    return { featured_products: [], new_arrivals: [], best_sellers: [] };
  }
}

export default async function Home() {
  const data = await getHome();

  const groups = [
    { key: "best", label: "Best sellers", products: data.best_sellers ?? [] },
    { key: "new", label: "New arrivals", products: data.new_arrivals ?? [] },
    { key: "featured", label: "Featured", products: data.featured_products ?? [] },
  ];

  const marqueeItems = [
    "925 Sterling Silver", "Egyptian", "Italian", "Turkish", "Local",
    "Custom-Made", "Hallmarked", "Delivery across Egypt", "Secure Tracking",
  ];

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
