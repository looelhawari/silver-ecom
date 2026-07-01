# Fidda Silver — Backend (Laravel)

The REST API + Filament admin panel for the Fidda Silver platform. Part of a modular
monolith — see the root [README](../README.md), [ARCHITECTURE](../ARCHITECTURE.md),
and [MODULES](../MODULES.md).

- Laravel 13 (PHP 8.3) · **MySQL** (SQLite for tests) · REST `/api/v1`
- Laravel Sanctum (token auth) · Spatie Laravel Permission (RBAC) · Filament v4 (`/admin`)

## Setup
```bash
cp .env.example .env            # set DB_* for your MySQL (Laragon: root / no password)
composer install
php artisan key:generate
php artisan migrate --seed      # tables + roles/permissions + super-admin + demo data
php artisan serve               # http://localhost:8000
```
- API base: `http://localhost:8000/api/v1` · health: `/api/v1/health`
- Admin: `http://localhost:8000/admin` — default `admin@fidda-silver.test` / `password`
  (from `ADMIN_*` env; **change before production**).

## Layout
```
app/
├── Models/User.php             # Sanctum + Spatie + FilamentUser + relations
├── Modules/<Module>/           # Models, Services, Actions, Http, Routes, Enums, Observers
│                               #   (charter in each Docs/README.md)
├── Filament/
│   ├── Resources/              # 12 admin resources (products, orders, custom requests, …)
│   ├── Pages/ManageStoreSettings + Widgets/ (stats, recent orders, revenue chart)
├── Providers/
│   ├── AppServiceProvider      # super-admin Gate::before, reset-link URL, admin-login audit
│   ├── ModuleServiceProvider   # auto-registers module API routes
│   └── Filament/AdminPanelProvider
├── Http/Middleware/SecurityHeaders.php
└── Support/                    # Modules/ (registry), Enums/HasLabels, Filament/AuthorizesWithPermission, Media/
config/   white_label.php · features.php · cors.php
database/ migrations (centralized) · seeders (roles, admin, silver types, categories,
          products, payment methods, content, settings)
```

## Conventions
- **Server-side money:** `Catalog\Services\PricingService` + `ProductObserver` (product
  prices); `Checkout\Services\CheckoutService` (order totals). Never trust the client.
- **Auth/permission:** Form Requests validate; Policies + Spatie permissions authorize;
  Filament resources gate via `Support\Filament\AuthorizesWithPermission`.
- **Module routing:** `ModuleRegistry` lists modules; those with a non-null prefix and a
  `Routes/api.php` auto-register under `/api/v1/{prefix}`.
- **Audit:** call `AuditLogs\Services\AuditLogger` for important admin actions.

## Tooling / tests
- `php artisan test` — **20 passing / 94 assertions** (`tests/Feature`: AdminPanelSmokeTest,
  StorefrontApiTest, AccountAndWorkflowTest).
- `./vendor/bin/pint` — code formatting.
