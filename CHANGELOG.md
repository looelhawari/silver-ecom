# Changelog

All notable changes per phase.

## [Phase 1] — 2026-07-01 — Project Setup & Foundation

### Added
- Filament v4 admin panel at `/admin`, branded silver/slate, role-gated via
  `User::canAccessPanel()`.
- Spatie roles & permissions seeder (5 admin roles + coarse permission taxonomy)
  and an env-driven super-admin seeder.
- Super-admin `Gate::before` bypass in `AppServiceProvider`.
- Frontend API client (`src/lib/api.ts`) with Sanctum-aware, typed fetch.
- Frontend env templates (`.env.example`, `.env.local`); backend `FRONTEND_URL` /
  `SANCTUM_STATEFUL_DOMAINS`.
- Full documentation suite: README, ARCHITECTURE, MODULES, DATABASE_SCHEMA,
  DATA_MODELS, API_DOCUMENTATION, SECURITY, PERFORMANCE, DEPLOYMENT,
  TODO_CHECKLIST, DECISIONS, CHANGELOG.
- Per-module `Docs/README.md` charters.

### Changed
- Retargeted the generic "White Label Commerce" template to the **Fidda Silver**
  jewelry brand: `silver-luxury` theme (pearl/charcoal/champagne), EGP currency,
  Africa/Cairo timezone, jewelry navigation/footer/categories, silver SEO, EN/AR
  i18n strings, brand monogram, silver home page (trust badges + custom-order CTA).
- Trimmed backend modules from 33 → **17** spec-aligned modules; rewrote
  `ModuleRegistry` and the modules README.
- Made `config/app.php` timezone env-driven (`Africa/Cairo` default).
- Reworked `config/white_label.php`, `config/features.php`, `backend/.env(.example)`
  to silver defaults.
- Cleaned the Zustand store (removed off-spec `compare`, added cart count).

### Removed
- Off-spec module folders (Brands, Collections, Compare, Inventory, Coupons,
  Reviews, ReturnsRefunds, ThemeBranding, SEO, Notifications, Integrations,
  Reports, ImportExport, plus folded Products/Categories/Customers/CMS).
- Generic template docs (replaced by the silver-specific suite).

### Verified
- `php artisan migrate:fresh --seed` succeeds; roles + super-admin created;
  `canAccessPanel` = true for super-admin.
- Filament routes (`/admin`, `/admin/login`) registered.
- Frontend `npm run build` succeeds (TypeScript clean, `/` prerendered).
