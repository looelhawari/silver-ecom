# Fidda Silver — Premium Silver Jewelry E-commerce

A production-oriented e-commerce platform for a premium silver jewelry business
selling **Egyptian, Italian, Turkish and local silver**, plus **custom-made silver
orders** from customer references.

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
  shadcn/Radix · TanStack Query · Zustand · React Hook Form + Zod · Motion ·
  next-intl (EN/AR, RTL-ready)
- **Backend:** Laravel 13 · MySQL (SQLite for local dev) · REST API ·
  Laravel Sanctum · Filament admin panel · Spatie Laravel Permission
- **Currency:** EGP · **Timezone:** Africa/Cairo

> `Fidda` (فِضّة) is Arabic for *silver*. The brand name, contact details, theme and
> all copy are configuration-driven — change them in `backend/.env` /
> `backend/config/white_label.php` and `frontend/src/config/*`. See
> [DECISIONS.md](DECISIONS.md).

## Repository layout

```
.
├── backend/    # Laravel 13 modular-monolith API + Filament admin
│   └── app/Modules/   # business modules (see MODULES.md)
├── frontend/   # Next.js 16 storefront (config-driven, i18n, RTL-ready)
└── *.md        # living documentation (architecture, modules, security, …)
```

## Documentation index

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, stack, request flow |
| [MODULES.md](MODULES.md) | Modular-monolith module map & boundaries |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Tables (current + planned) |
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

## Development model

Work proceeded **phase by phase**. Current status: **Phases 1–9 complete** — a
working storefront (browse, cart, checkout, order & custom-request tracking,
accounts, wishlist, invoices), a Filament admin, security hardening, and SEO/
production readiness. See [TODO_CHECKLIST.md](TODO_CHECKLIST.md) for the detail and
the small deferred items (coupons, invoice PDF, password-reset email delivery, Arabic UI).

### Highlights
- **Storefront:** home, shop (filter/sort/search), product detail, cart, checkout
  (server-validated), order success + tracking + printable invoice, custom-order
  request + tracking with quotes, accounts (profile/addresses/orders/requests),
  wishlist, content/policy pages.
- **Admin (`/admin`):** products (images/variants/pricing), categories, silver types
  & gram prices, orders (+payment-proof review), custom requests (+convert to order),
  customers, payment methods, content, support, audit log, dashboard widgets.
- **Security:** server-side pricing, role-gated admin, owner-only records, guest
  tracking by code+phone, validated uploads, CORS + security headers, rate limits.
- **Tests:** `php artisan test` → 19 passing (92 assertions).

## Security notes (Phase 1)

- Admin panel access is gated by role via `User::canAccessPanel()` — storefront
  customers cannot reach `/admin`, including in production.
- Secrets live only in `.env` (git-ignored); `.env.example` ships safe placeholders.
- Super-admin credentials are seeded from env, never hardcoded.

See [SECURITY.md](SECURITY.md) for the full control list and the per-phase checklist.
