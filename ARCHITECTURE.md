# Architecture

## Overview

Fidda Silver is a **modular monolith**: two deployable applications (one Laravel
backend, one Next.js frontend), one database, internally organized into modules
with clear boundaries. This avoids both the chaos of an unstructured monolith and
the operational overhead of true microservices.

```
┌──────────────────────────┐         REST/JSON over HTTPS         ┌──────────────────────────┐
│  Next.js 16 storefront    │  ──────────────────────────────▶    │  Laravel 13 API           │
│  (App Router, RSC)        │   /api/v1/*   (Sanctum auth)         │  modular monolith         │
│  TanStack Query + Zustand │  ◀──────────────────────────────    │                           │
└──────────────────────────┘                                      │  Filament admin  /admin   │
                                                                   └────────────┬──────────────┘
                                                                                │ Eloquent
                                                                   ┌────────────▼──────────────┐
                                                                   │  MySQL (SQLite in dev)     │
                                                                   └────────────────────────────┘
```

## Backend

- **Framework:** Laravel 13 (PHP 8.3).
- **Module system:** every business area is a folder under `app/Modules/*`.
  [`ModuleRegistry`](backend/app/Support/Modules/ModuleRegistry.php) is the single
  source of truth; [`ModuleServiceProvider`](backend/app/Providers/ModuleServiceProvider.php)
  auto-registers each module's `Routes/api.php` under `/api/v1/{prefix}` when the
  module declares a prefix. See [MODULES.md](MODULES.md).
- **API:** versioned REST under `/api/v1`. Responses use Laravel API Resources;
  validation uses Form Requests; authorization uses Policies + Spatie permissions.
- **Auth:** Laravel Sanctum **bearer tokens** for the storefront (register/login issue a
  token; `auth:sanctum` guards account/profile/wishlist routes). The Filament admin uses
  the session guard; access is role-gated via `User::canAccessPanel()`.
- **Security:** CORS restricted to the frontend origin (credentials-aware, `config/cors.php`),
  a global `SecurityHeaders` middleware, JSON errors for `/api/*`, and per-endpoint rate
  limits. See [SECURITY.md](SECURITY.md).
- **Admin:** Filament v4 panel at `/admin`, silver/slate theme; resources per domain plus
  a Store Settings page; dashboard widgets (stats, recent orders, revenue chart).
- **Pricing:** all money math is **server-side** — `Catalog\Services\PricingService`
  (product prices, persisted by `ProductObserver`) and `Checkout\Services\CheckoutService`
  (order totals, stock-checked in a transaction). The client never sets prices or totals.
- **Auditing:** `AuditLogs\Services\AuditLogger` records product CRUD, gram-price and
  order-status changes, settings updates, and admin logins.

### Request lifecycle (API)

1. Request hits `/api/v1/{module-prefix}/...`.
2. Global `api` middleware (throttle, JSON) runs; route is matched from the owning
   module's `Routes/api.php`.
3. A Form Request validates input; a Policy authorizes the action.
4. A Controller delegates to a module Service/Action (business logic).
5. An API Resource shapes the JSON response.

## Frontend

- **Framework:** Next.js 16 App Router.
  > This Next.js build has non-standard conventions — see `frontend/AGENTS.md` and
  > `node_modules/next/dist/docs/`. Notably `params`/`searchParams` are Promises.
- **Rendering split:** content/listing/detail routes are **server components**
  (SEO + `generateMetadata`, data fetched server-side); interactive routes
  (cart, checkout, account, shop filters, homepage motion) are **client components**.
- **Structure:** `src/app` (routes + sitemap/robots), `src/components/{layout,home,
  storefront,ui,providers}`, `src/config` (white-label + `homepageData`), `src/lib`
  (`api.ts`, `auth-token.ts`, `format.ts`), `src/stores` (Zustand), `src/types`,
  `src/i18n` + `src/messages`. Full map in [frontend/README.md](frontend/README.md).
- **Data access:** everything goes through `src/lib/api.ts` (`apiFetch`) — JSON,
  `credentials: include`, attaches the bearer token, throws typed `ApiError`.
- **Auth:** `stores/useAuthStore` (login/register/logout/me) + `lib/auth-token.ts`
  (token in localStorage); `AppProviders` hydrates the session on boot.
- **State:** TanStack Query for server state; Zustand for cart/auth/UI.
- **Config-driven branding:** `src/config/*` mirrors the backend's
  `config/white_label.php`, so the storefront is white-label without code changes.
- **i18n / RTL:** next-intl with `en` (LTR) and `ar` (RTL); `dir` from the active locale.
- **Theme + motion:** CSS variables in `globals.css` (active preset `silver-luxury`:
  pearl / charcoal / champagne) plus GPU-only motion keyframes. Homepage animations
  (typing, count-up, tilt, marquee, spotlight, scroll-progress) are lightweight and
  `prefers-reduced-motion` aware — see [PERFORMANCE.md](PERFORMANCE.md).

## Data flow (storefront example)

1. A server page (`app/products/[slug]/page.tsx`) calls `apiFetch('/products/{slug}')`
   and renders + `generateMetadata`.
2. Interactive bits (add to cart, variant select, share) are client components.
3. Cart lives client-side (Zustand); at checkout the client sends only ids+quantities,
   and the server recomputes prices/totals (`CheckoutService`) before creating the order.

## Environments

- **Local dev:** SQLite, `php artisan serve` (:8000), `npm run dev` (:3000).
- **Production:** MySQL 8, Nginx + PHP-FPM, queue worker, scheduler/cron, HTTPS.
  See [DEPLOYMENT.md](DEPLOYMENT.md).
