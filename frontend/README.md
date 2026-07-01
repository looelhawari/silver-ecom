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
All customer pages are prefixed by locale: `/en/...` and `/ar-EG/...`.
Storefront: `/[locale]` (luxury homepage), `/[locale]/shop`, `/[locale]/category/[slug]`,
`/[locale]/products/[slug]`, `/[locale]/cart`, `/[locale]/checkout`,
`/[locale]/order/success`, `/[locale]/order/invoice` (printable),
`/[locale]/track-order`, `/[locale]/custom-order`, `/[locale]/track-custom`.
Account: `/[locale]/login`, `/[locale]/register`, `/[locale]/forgot-password`,
`/[locale]/reset-password`, `/[locale]/account`, `/[locale]/account/orders`,
`/[locale]/account/requests`, `/[locale]/wishlist`.
Content: `/[locale]/about`, `/[locale]/contact`, `/[locale]/faq`,
`/[locale]/privacy-policy`, `/[locale]/terms`, `/[locale]/returns-policy`,
`/[locale]/silver-care`.
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
├── i18n/ · messages/       # next-intl routing + en/ar-EG catalogs
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
| `messages/{en,ar-EG}.json` | i18n strings |

## Localization
- `src/i18n/routing.ts` defines `en` and `ar-EG` with `localePrefix: "always"`.
- `src/app/[locale]/layout.tsx` sets `<html lang>` and `dir`; Arabic uses RTL.
- `components/language/language-switcher.tsx` preserves the active path/query.
- `lib/api.ts` sends the active locale as `Accept-Language`; API callers can also
  use `?locale=en|ar-EG`.
- Product/category/CMS helpers use `localizedField` so missing Arabic content
  falls back to English.

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
