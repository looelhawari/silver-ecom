# Fidda Silver — Backend (Laravel)

The REST API + Filament admin panel for the Fidda Silver e-commerce platform.
Part of a modular monolith — see the root [README](../README.md),
[ARCHITECTURE](../ARCHITECTURE.md), and [MODULES](../MODULES.md).

- Laravel 13 (PHP 8.3) · MySQL (SQLite in dev) · REST `/api/v1`
- Laravel Sanctum (auth) · Spatie Laravel Permission (RBAC) · Filament v4 (`/admin`)

## Setup

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed     # tables + roles/permissions + super-admin
php artisan serve              # http://localhost:8000
```

- API base: `http://localhost:8000/api/v1` · health: `/api/v1/health`
- Admin: `http://localhost:8000/admin` — default `admin@fidda-silver.test` /
  `password` (from `ADMIN_*` env; **change before production**).

## Layout

```
app/
├── Models/                     # framework User (Sanctum + Spatie + Filament)
├── Modules/<Module>/           # business modules (charter in each Docs/README.md)
├── Providers/
│   ├── AppServiceProvider      # super-admin Gate::before bypass
│   ├── ModuleServiceProvider   # auto-registers module API routes
│   └── Filament/AdminPanelProvider
└── Support/Modules/            # ModuleRegistry + ModuleDefinition
config/  white_label.php · features.php (white-label/store config)
database/  migrations · seeders (RolesAndPermissions, AdminUser)
```

## Module routing

`ModuleRegistry` lists every module; modules with a non-null API prefix and a
`Routes/api.php` auto-register under `/api/v1/{prefix}`. See [MODULES.md](../MODULES.md).

## Tooling
- `composer test` / `php artisan test` — tests (Pest/PHPUnit)
- `./vendor/bin/pint` — code formatting
