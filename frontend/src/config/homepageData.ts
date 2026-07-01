/**
 * Homepage content — mock/config today, API-ready tomorrow.
 * Featured products & categories come from the live API (`/home`); the editorial
 * content below (collections, reviews, FAQ preview, steps, etc.) is configured here
 * so it can later move to a CMS/settings endpoint without touching components.
 *
 * Placeholder imagery uses LoremFlickr (keyword + stable `lock`). Replace with real
 * brand photography for production.
 */

const photo = (keyword: string, lock: number, w = 800, h = 800): string =>
  `https://loremflickr.com/${w}/${h}/${keyword}?lock=${lock}`;

export type HeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  image: string;
  floatingCards: { title: string; caption: string; image: string }[];
};

export type TrustPoint = { icon: string; title: string; description: string };
export type ShowcaseCategory = { name: string; slug: string; description: string; image: string };
export type Collection = { name: string; description: string; href: string; image: string; size: "large" | "small" };
export type Step = { title: string; description: string };
export type Review = { name: string; product: string; rating: number; quote: string };
export type FaqItem = { question: string; answer: string };
export type CalculatorType = { label: string; ratePerGram: number };

export const announcements: string[] = [
  "Handcrafted silver • Custom orders available • Delivery across Egypt",
  "Prices are confirmed by our team before every order is completed",
  "Secure ordering • Manual payment support • WhatsApp assistance",
];

export const hero: HeroContent = {
  eyebrow: "Handcrafted 925 silver",
  headline: "Silver Pieces Made to Be Remembered",
  subheadline:
    "Elegant Egyptian, Italian, Turkish and custom-made silver jewelry — crafted for everyday luxury and the moments you keep.",
  image: photo("silver,jewelry,necklace", 501, 1200, 1400),
  floatingCards: [
    { title: "Italian chain", caption: "925 · polished", image: photo("silver,chain", 502, 400, 400) },
    { title: "Custom ring", caption: "made to order", image: photo("silver,ring", 503, 400, 400) },
  ],
};

export const trustPoints: TrustPoint[] = [
  { icon: "shield-check", title: "Secure ordering", description: "Totals confirmed server-side. Pay safely, your way." },
  { icon: "gem", title: "Quality-checked silver", description: "Egyptian, Italian, Turkish & local 925 — hallmarked." },
  { icon: "pencil-ruler", title: "Custom design requests", description: "Send a reference; we craft it in silver." },
  { icon: "message-circle", title: "Fast WhatsApp support", description: "Real people, quick answers, every day." },
];

export const showcaseCategories: ShowcaseCategory[] = [
  { name: "Rings", slug: "rings", description: "Bands, solitaires & statement pieces.", image: photo("silver,ring", 511) },
  { name: "Necklaces", slug: "necklaces", description: "Pendants and delicate chains.", image: photo("silver,necklace", 512) },
  { name: "Bracelets", slug: "bracelets", description: "Cuffs, links & charm bracelets.", image: photo("silver,bracelet", 513) },
  { name: "Earrings", slug: "earrings", description: "Studs, hoops & drops.", image: photo("silver,earrings", 514) },
  { name: "Chains", slug: "chains", description: "Figaro, rope, snake & more.", image: photo("silver,chain", 515) },
  { name: "Custom pieces", slug: "custom", description: "Designed with you, made for you.", image: photo("silver,jewelry", 516) },
];

export const collections: Collection[] = [
  { name: "Egyptian Silver Classics", description: "Timeless local craftsmanship.", href: "/shop?silver_type=egyptian-silver", image: photo("silver,jewelry,egyptian", 521), size: "large" },
  { name: "Italian Elegance", description: "Refined, polished, effortless.", href: "/shop?silver_type=italian-silver", image: photo("silver,necklace,italian", 522), size: "small" },
  { name: "Turkish Details", description: "Intricate, ornate, distinctive.", href: "/shop?silver_type=turkish-silver", image: photo("silver,ring,turkish", 523), size: "small" },
  { name: "Everyday Silver", description: "Pieces made to be worn daily.", href: "/shop", image: photo("silver,bracelet", 524), size: "small" },
  { name: "Gifts Under Budget", description: "Thoughtful silver, gift-ready.", href: "/category/gifts", image: photo("silver,gift", 525), size: "small" },
  { name: "Custom-Made Designs", description: "Your idea, crafted in silver.", href: "/custom-order", image: photo("silver,jewelry,handmade", 526), size: "large" },
];

export const customSteps: Step[] = [
  { title: "Upload a reference", description: "Share a photo or describe the piece you imagine." },
  { title: "Add the details", description: "Silver type, size, weight and any special notes." },
  { title: "Get a clear quote", description: "Our team reviews and sends you a transparent price." },
  { title: "Confirm & track", description: "Approve the quote and follow your order with a code." },
];

export const pricingPoints: string[] = [
  "Silver prices move with the market — we confirm the rate before your order is completed.",
  "Product prices reflect weight, silver type, workmanship and design complexity.",
  "Custom orders always receive a clear written quote before you commit.",
];

export const calculatorTypes: CalculatorType[] = [
  { label: "Egyptian silver", ratePerGram: 42 },
  { label: "Local silver", ratePerGram: 38 },
  { label: "Turkish silver", ratePerGram: 50 },
  { label: "Italian silver", ratePerGram: 55 },
];

export const whyBuy: TrustPoint[] = [
  { icon: "sparkles", title: "Carefully selected pieces", description: "Every item is checked before it ships." },
  { icon: "pencil-ruler", title: "Custom-made designs", description: "Bring your own idea to life in silver." },
  { icon: "receipt-text", title: "Clear pricing & tracking", description: "Know your total and follow every step." },
  { icon: "wallet", title: "Manual payment support", description: "COD, Vodafone Cash, InstaPay & bank transfer." },
  { icon: "message-circle", title: "Friendly WhatsApp help", description: "We answer questions before and after ordering." },
  { icon: "truck", title: "Delivery across Egypt", description: "Carefully packed and tracked to your door." },
];

export const trackingSteps: string[] = [
  "Pending", "Confirmed", "Preparing", "Ready to Ship", "Shipped", "Delivered",
];

export const paymentSteps: Step[] = [
  { title: "Choose your method", description: "COD, Vodafone Cash, InstaPay or bank transfer at checkout." },
  { title: "Upload proof if needed", description: "For wallet/bank transfers, attach your receipt." },
  { title: "We confirm payment", description: "Our team reviews and approves your payment." },
  { title: "Status updates clearly", description: "Watch your order move from confirmed to delivered." },
];

export const paymentMethods: string[] = ["Cash on Delivery", "Vodafone Cash", "InstaPay", "Bank Transfer"];

export const reviews: Review[] = [
  { name: "Mariam", product: "Silver bracelet", rating: 5, quote: "The bracelet looked even better than the photos. Beautifully packed." },
  { name: "Omar", product: "Custom ring", rating: 5, quote: "I requested a custom ring and got a clear quote before confirming. Smooth." },
  { name: "Salma", product: "Necklace", rating: 5, quote: "Order tracking made me feel safe the whole way through." },
  { name: "Youssef", product: "Italian chain", rating: 4, quote: "Great quality for the price and quick replies on WhatsApp." },
  { name: "Nour", product: "Earrings", rating: 5, quote: "Delicate and elegant — exactly what I hoped for." },
  { name: "Hana", product: "Anklet", rating: 5, quote: "Arrived faster than expected and the finish is lovely." },
];

export const socialImages: string[] = [
  photo("silver,ring", 531, 500, 500),
  photo("silver,necklace", 532, 500, 500),
  photo("silver,bracelet", 533, 500, 500),
  photo("silver,earrings", 534, 500, 500),
  photo("silver,chain", 535, 500, 500),
  photo("silver,jewelry", 536, 500, 500),
];

export const faqPreview: FaqItem[] = [
  { question: "Do you accept custom silver orders?", answer: "Yes. Upload a reference or describe your idea, and we'll send a clear quote before you confirm." },
  { question: "Can I track my order?", answer: "Every order gets a code you can use on the Track Order page with your phone number." },
  { question: "What payment methods are available?", answer: "Cash on delivery, Vodafone Cash, InstaPay and bank transfer — with proof upload where needed." },
  { question: "Does the price include workmanship?", answer: "Product prices reflect silver weight, type and workmanship. Custom orders receive a detailed quote." },
  { question: "Can I return or exchange custom orders?", answer: "Ready-made pieces can be exchanged within 14 days. Custom pieces are made to order, so they're non-refundable unless faulty." },
];
