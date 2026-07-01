# Fidda Silver — Storefront (Next.js)

Customer-facing storefront for the Fidda Silver platform. Part of a modular monolith —
see the root [README](../README.md) and [ARCHITECTURE](../ARCHITECTURE.md).

- Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind CSS v4
- shadcn/Radix · **Motion** · Lucide · TanStack Query · Zustand · Sonner · next-intl

> ⚠️ This Next.js build has **non-standard conventions** (see [AGENTS.md](AGENTS.md)).
> Read `node_modules/next/dist/docs/` before adding framework-level code. Key gotcha:
> `params`/`searchParams` are **Promises** (`const { slug } = await params`).

## Getting started
```bash
cp .env.example .env.local      # NEXT_PUBLIC_API_URL → Laravel API, NEXT_PUBLIC_SITE_URL
npm install                     # already vendored in this repo
npm run dev                     # http://localhost:3000  (backend must be running)
```

## Routes (`src/app`)
Storefront: `/` (luxury homepage), `/shop`, `/category/[slug]`, `/products/[slug]`,
`/cart`, `/checkout`, `/order/success`, `/order/invoice` (printable), `/track-order`,
`/custom-order`, `/track-custom`.
Account: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/account`,
`/account/orders`, `/account/requests`, `/wishlist`.
Content: `/about`, `/contact`, `/faq`, `/privacy-policy`, `/terms`, `/returns-policy`,
`/silver-care`.
Infra: `sitemap.ts`, `robots.ts`, `not-found.tsx`, `error.tsx`, `loading.tsx`.

Rendering: content/listing/detail pages are **server components** (SEO, `generateMetadata`);
interactive pages (cart, checkout, account, shop filters) are **client components**.

## Structure
```
src/
├── app/                    # routes + globals.css + sitemap/robots/metadata
├── components/
│   ├── layout/             # LuxuryNavbar (site-header), announcement-bar, footer,
│   │                       #   storefront-shell, newsletter-form, header cart/account
│   ├── home/               # homepage sections + shared + interactive (see below)
│   ├── storefront/         # product-card, product-purchase, shop-browser,
│   │                       #   track/order/custom/invoice/reset views, cms-page,
│   │                       #   payment-proof-upload
│   ├── providers/          # app-providers (QueryClient, Toaster, auth hydrate)
│   └── ui/                 # button (shadcn)
├── config/                 # white-label config + homepageData (see below)
├── i18n/ · messages/       # next-intl routing + en/ar catalogs
├── lib/                    # api.ts, auth-token.ts, format.ts, utils.ts
├── stores/                 # useCartStore, useAuthStore, useStorefrontStore (Zustand)
└── types/                  # commerce.ts, catalog.ts
```

## Homepage (`components/home`)
Sections: `hero-section`, `trust-strip`, `category-showcase`, `signature-collections`,
`featured-products`, `custom-order-story`, `pricing-transparency`, `why-buy`,
`order-tracking-preview`, `payment-trust`, `review-section`, `social-showcase`,
`faq-preview`, `final-cta`.
Shared: `section-header`, `reveal` (scroll-in), `trust-badge` (spotlight), `category-card`,
`collection-tile`, `icons` (name→lucide map).
**Interactive (lightweight, GPU, reduced-motion aware):** `typing-text`, `count-up`,
`tilt`, `scroll-progress`, `marquee`. See PERFORMANCE.md for the animation rules.

Editorial homepage content is in **`src/config/homepageData.ts`** (announcements, hero,
collections, steps, reviews, FAQ preview, calculator rates, social). Featured products
come from the live `/home` API. Placeholder imagery is LoremFlickr — swap for real photos.

## Configuration (white-label — mirrors backend `config/white_label.php`)
| File | Controls |
|------|----------|
| `config/storeConfig.ts` | Name, slogan, currency, contact, hero |
| `config/themeConfig.ts` | Theme presets (`silver-luxury` active) |
| `config/navigationConfig.ts` | Header nav + category strip |
| `config/footerConfig.ts` | Footer sections |
| `config/seoConfig.ts` | Default title/description/keywords/OG |
| `config/featureFlags.ts` | wishlist, custom orders, guest checkout, order tracking |
| `config/homepageData.ts` | Homepage editorial content |
| `app/globals.css` | Theme CSS variables + motion keyframes |
| `messages/{en,ar}.json` | i18n strings |

## Data & auth
- **`lib/api.ts`** — typed `apiFetch` wrapper: JSON, `credentials: include`, attaches the
  bearer token from `lib/auth-token.ts`, throws typed `ApiError`.
- **Auth** — Sanctum **token** auth. `stores/useAuthStore` handles login/register/logout/me;
  the token is stored via `auth-token.ts` (localStorage); `AppProviders` calls `loadMe()`
  on boot. Account pages redirect to `/login` when unauthenticated.
- **Cart** — `stores/useCartStore` (persisted). Prices are re-validated server-side at
  checkout (`/checkout/validate` + `/checkout/place-order`).

## Accessibility & SEO
Semantic sections, single `<h1>` on the homepage, icon buttons carry `aria-label`,
keyboard-accessible nav + mobile menu, visible focus (theme `--ring`), alt text on
images, `prefers-reduced-motion` honored, per-route metadata + sitemap/robots.

## Scripts
`npm run dev` · `npm run build` · `npm run start` · `npm run lint`
