# Fidda Silver — Premium Silver Jewelry E-commerce

A production-oriented e-commerce platform for a premium silver jewelry business
selling **Egyptian, Italian, Turkish and local silver**, plus **custom-made silver
orders** from customer references.

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
  shadcn/Radix · TanStack Query · Zustand · React Hook Form + Zod · Motion ·
  next-intl (`en`/`ar-EG`, RTL)
- **Backend:** Laravel 13 · **MySQL** (SQLite for tests) · REST API ·
  Laravel Sanctum (token auth) · Filament v4 admin panel · Spatie Laravel Permission
- **Currency:** EGP · **Timezone:** Africa/Cairo
- **Status:** Phases 1–9 complete + luxury animated homepage + public-site
  localization. Backend `php artisan test` → **21 passing / 101 assertions**;
  frontend lint/build clean (locale-prefixed routes).

> `Fidda` (فِضّة) is Arabic for *silver*. The brand name, contact details, theme and
> all copy are configuration-driven — change them in `backend/.env` /
> `backend/config/white_label.php` and `frontend/src/config/*`. See
> [DECISIONS.md](DECISIONS.md).

## Repository layout

```
.
├── backend/    # Laravel 13 modular-monolith API + Filament admin
│   └── app/Modules/   # business modules (see MODULES.md)
├── frontend/   # Next.js 16 storefront (config-driven, /en + /ar-EG)
└── *.md        # living documentation (architecture, modules, security, …)
```

## Documentation index

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, stack, request flow |
| [MODULES.md](MODULES.md) | Modular-monolith module map & boundaries |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Tables, seeds & migrations |
| [DATA_MODELS.md](DATA_MODELS.md) | Domain models & relationships |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST API surface |
| [SECURITY.md](SECURITY.md) | Security controls & checklist |
| [PERFORMANCE.md](PERFORMANCE.md) | Performance strategy |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Ubuntu/Nginx/MySQL deployment guide |
| [TODO_CHECKLIST.md](TODO_CHECKLIST.md) | Phase-by-phase progress |
| [CHANGELOG.md](CHANGELOG.md) | Notable changes per phase |
| [DECISIONS.md](DECISIONS.md) | Architecture decision log |

## Prerequisites

- PHP 8.3+, Composer 2.x
- Node.js 20+ (built/tested on Node 25), npm 11
- MySQL 8 (production) — local dev defaults to SQLite, no DB server needed

## Quick start

### Backend (`backend/`)

```bash
cd backend
cp .env.example .env          # adjust as needed (SQLite by default)
composer install              # (dependencies already vendored in this repo)
php artisan key:generate
php artisan migrate --seed     # creates tables, roles/permissions, super-admin
php artisan serve              # http://localhost:8000
```

- API base: `http://localhost:8000/api/v1`
- Health check: `GET /api/v1/health`
- Admin panel: `http://localhost:8000/admin`
  - Default super-admin (local only — **change before production**):
    `admin@fidda-silver.test` / `password` (from `ADMIN_*` env vars)

### Frontend (`frontend/`)

```bash
cd frontend
cp .env.example .env.local     # NEXT_PUBLIC_API_URL → backend API
npm install                    # (node_modules already present in this repo)
npm run dev                    # http://localhost:3000
```

## Localization

- Storefront pages live under `/en` and `/ar-EG`; root requests redirect through
  next-intl middleware.
- `ar-EG` renders `<html dir="rtl">`; `en` renders LTR. The language switcher
  preserves the current path and query string.
- API locale is resolved from `?locale=en|ar-EG` first, then `Accept-Language`;
  unsupported values fall back to English.
- API resources expose localized display fields plus raw `*_en` / `*_ar` fields
  for future admin editing. The admin dashboard translation UX is deferred to
  part two by request.

## Development model

Work proceeded **phase by phase**. Current status: **Phases 1–9 complete** — a
working storefront (browse, cart, checkout, order & custom-request tracking,
accounts, wishlist, invoices), a Filament admin, security hardening, and SEO/
production readiness. See [TODO_CHECKLIST.md](TODO_CHECKLIST.md) for the detail and
the small deferred items (coupons, invoice PDF, password-reset email delivery, Arabic UI).

### Highlights
- **Luxury homepage:** cinematic hero with a typing effect + count-up stats + cursor
  tilt, silver marquee, scroll-progress bar, spotlight cards, editorial collections,
  live estimate calculator, animated order-tracking timeline — all GPU-light and
  `prefers-reduced-motion` aware.
- **Storefront:** shop (filter by category/silver-type/price/weight, sort, search),
  product detail (gallery/variants/share/wishlist), cart, checkout (server-validated),
  order success + tracking + printable invoice, custom-order request + tracking with
  quote accept/reject, accounts (profile/addresses/orders/requests), content/policy pages.
- **Admin (`/admin`):** products (images/variants/pricing), categories, silver types
  & gram prices, orders (+payment-proof review), custom requests (+convert to order),
  customers (with orders/requests/notes), payment methods, content, support, audit log,
  **store settings page**, dashboard widgets (stats, recent orders, revenue chart).
- **Security:** server-side pricing, role-gated admin, owner-only records, guest
  tracking by code+phone, validated uploads, CORS + security headers, rate limits.

## Developer guide

**Mental model.** One Laravel app (`backend/`) exposing a versioned REST API + a
Filament admin, and one Next.js app (`frontend/`). The backend is a *modular monolith*:
business logic lives in `app/Modules/<Module>/` (Models, Services, Actions, Http,
Routes, Filament resources live under `app/Filament`). See [MODULES.md](MODULES.md).

**Golden rules.**
- **Never trust client money.** Product prices come from `Catalog\Services\PricingService`
  (persisted by `ProductObserver`); order totals from `Checkout\Services\CheckoutService`.
- **Validate + authorize** every request: Form Requests + Policies/Spatie permissions;
  customers only touch their own records; guest tracking needs code + phone.
- **Config-driven branding** — no hardcoded brand strings; change `backend/.env` /
  `config/white_label.php` and `frontend/src/config/*`.
- Frontend: server components for data/SEO, client components for interactivity; all
  API calls go through `frontend/src/lib/api.ts`.

**Add a catalog-style feature end-to-end.**
1. Migration in `backend/database/migrations` → model in the module's `Models/`.
2. Form Request + API Resource + controller in the module's `Http/` → route in
   `Routes/api.php` (set a prefix in `ModuleRegistry` to expose it).
3. Filament resource under `app/Filament/Resources` (gate with `AuthorizesWithPermission`).
4. Frontend: type in `src/types`, fetch via `apiFetch`, render in a page/component.
5. Tests in `backend/tests/Feature`; update the relevant `.md`.

**Run the tests / build.** `cd backend && php artisan test` · `cd frontend && npm run build`.

## Security notes

- Admin panel access is gated by role via `User::canAccessPanel()` — storefront
  customers cannot reach `/admin`, including in production.
- Secrets live only in `.env` (git-ignored); `.env.example` ships safe placeholders.
- Super-admin credentials are seeded from env, never hardcoded.

See [SECURITY.md](SECURITY.md) for the full control list and the per-phase checklist.
