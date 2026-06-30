import type { FooterSection } from "@/types/commerce";

export const footerSections: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "All silver", href: "/shop" },
      { label: "New arrivals", href: "/shop?sort=new" },
      { label: "Best sellers", href: "/shop?sort=best-sellers" },
      { label: "Custom order", href: "/custom-order" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Track order", href: "/track-order" },
      { label: "FAQ", href: "/faq" },
      { label: "Silver care guide", href: "/silver-care" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Returns & exchange", href: "/returns-policy" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
