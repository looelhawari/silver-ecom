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
- **Auth:** Laravel Sanctum (SPA cookie + token support). Admin uses Filament's
  session guard; access is role-gated via `User::canAccessPanel()`.
- **Admin:** Filament panel at `/admin`, primary brand color set to silver/slate.
- **Pricing:** all money math is **server-side** (Catalog pricing engine + Checkout).
  The client never sets prices or totals.

### Request lifecycle (API)

1. Request hits `/api/v1/{module-prefix}/...`.
2. Global `api` middleware (throttle, JSON) runs; route is matched from the owning
   module's `Routes/api.php`.
3. A Form Request validates input; a Policy authorizes the action.
4. A Controller delegates to a module Service/Action (business logic).
5. An API Resource shapes the JSON response.

## Frontend

- **Framework:** Next.js 16 App Router with React Server Components.
  > Note: this Next.js build has non-standard conventions — see
  > `frontend/AGENTS.md`. Consult `node_modules/next/dist/docs/` before adding
  > framework-level code.
- **Config-driven branding:** `src/config/*` (store, theme, navigation, footer,
  SEO, features, integrations) mirrors the backend's `config/white_label.php`, so
  the storefront is white-label and rebrandable without code changes.
- **State:** TanStack Query for server state; Zustand for light UI state (cart
  drawer, counts).
- **Data access:** `src/lib/api.ts` is a typed fetch wrapper (JSON, Sanctum
  credentials, typed errors).
- **i18n / RTL:** next-intl with `en` (LTR) and `ar` (RTL); `dir` derives from
  the active locale.
- **Theme:** CSS variables in `globals.css` driven by the active preset
  (`silver-luxury`): pearl base, charcoal text, champagne accent.

## Environments

- **Local dev:** SQLite, `php artisan serve` (:8000), `npm run dev` (:3000).
- **Production:** MySQL 8, Nginx + PHP-FPM, queue worker, scheduler/cron, HTTPS.
  See [DEPLOYMENT.md](DEPLOYMENT.md).
