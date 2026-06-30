# TODO Checklist

Legend: `[x]` done · `[~]` partial · `[ ]` pending. Phases follow the project plan
(report after each phase, then wait for approval).

## Phase 1 — Project Setup & Foundation  ✅ complete
- [x] Backend (Laravel 13) + frontend (Next.js 16) set up
- [x] Modular-monolith structure trimmed to lean silver-jewelry module set (17)
- [x] Module registry + auto route loader; per-module charter docs
- [x] Database configured (SQLite dev / MySQL prod) + migrated
- [x] Authentication foundation (Sanctum) + Spatie roles/permissions seeded
- [x] Filament admin panel at `/admin`, role-gated, super-admin seeded
- [x] Africa/Cairo timezone, EGP currency, EN/AR + RTL-ready structure
- [x] Frontend retargeted to silver brand (theme, nav, footer, SEO, home, i18n)
- [x] Frontend API client + env wiring; production build verified
- [x] Documentation suite (README + 11 docs) created
- [x] Single clean git repo on `main`, remote configured

## Phase 2 — Database & Core Backend
- [ ] Migrations + models for Catalog, Cart, Orders, Payments, Shipping,
      CustomOrders, Content, Support, Users(addresses), Wishlist, AuditLogs
- [ ] Relationships, casts, `$fillable` allowlists
- [ ] Seeders: categories, silver types, demo products, settings
- [ ] Form Requests + API Resource pattern
- [ ] Bilingual (EN/AR) field strategy decided + applied

## Phase 3 — Admin Dashboard
- [ ] Filament resources: products, categories, silver types (+ gram prices)
- [ ] Orders, custom requests, customers, support, settings, audit logs
- [ ] Per-resource permission checks; dashboard widgets/charts

## Phase 4 — Public Website UI
- [ ] Home, product listing, product details, cart, checkout (UI)
- [ ] Track order, custom request, about, contact, FAQ, policies
- [ ] Loading/empty/error states, toasts, responsive polish

## Phase 5 — Order Workflow
- [ ] Cart + checkout logic, **server-side** pricing & totals
- [ ] Order creation, order-code generation, status history
- [ ] Payment method selection, admin order editing, customer tracking

## Phase 6 — Custom Silver Workflow
- [ ] Submit request + secure image upload, tracking code
- [ ] Admin review/quote, accept/reject, convert-to-order

## Phase 7 — Profile & Customer Account
- [ ] Register/login/logout, profile, addresses, order & request history,
      change password

## Phase 8 — Security & Validation Pass
- [ ] Forms, uploads, authorization, permissions, rate limiting, error handling,
      privacy pages, debug-leak removal

## Phase 9 — UI Polish & Production Readiness
- [ ] Design/responsiveness/states polish, SEO metadata, sitemap/robots
- [ ] Final README/deploy/test checklist
