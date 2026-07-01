import type { FooterSection } from "@/types/commerce";

export const footerSections: FooterSection[] = [
  {
    title: "Shop",
    titleKey: "sections.shop.title",
    links: [
      { label: "All silver", labelKey: "sections.shop.allSilver", href: "/shop" },
      { label: "New arrivals", labelKey: "sections.shop.newArrivals", href: "/shop?sort=new" },
      { label: "Best sellers", labelKey: "sections.shop.bestSellers", href: "/shop?sort=best-sellers" },
      { label: "Custom order", labelKey: "sections.shop.customOrder", href: "/custom-order" },
    ],
  },
  {
    title: "Support",
    titleKey: "sections.support.title",
    links: [
      { label: "Contact", labelKey: "sections.support.contact", href: "/contact" },
      { label: "Track order", labelKey: "sections.support.trackOrder", href: "/track-order" },
      { label: "FAQ", labelKey: "sections.support.faq", href: "/faq" },
      { label: "Silver care guide", labelKey: "sections.support.silverCareGuide", href: "/silver-care" },
    ],
  },
  {
    title: "Policies",
    titleKey: "sections.policies.title",
    links: [
      { label: "Returns & exchange", labelKey: "sections.policies.returnsExchange", href: "/returns-policy" },
      { label: "Privacy", labelKey: "sections.policies.privacy", href: "/privacy-policy" },
      { label: "Terms", labelKey: "sections.policies.terms", href: "/terms" },
    ],
  },
];
