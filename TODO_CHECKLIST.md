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

> **MySQL** is now the active DB (Laragon, `fidda_silver`). Batches run 3 phases
> at a time. Some Phase 5/6 backend (order placement, custom submission) was pulled
> forward so Phase 4 pages are functional end-to-end.

## Phase 2 — Database & Core Backend  ✅ complete
- [x] Migrations for Catalog, Users(+addresses), Payments, Cart, Orders, Shipping,
      CustomOrders, Content, Support, Wishlist, AuditLogs (11 migrations)
- [x] Eloquent models with relationships, casts, `$fillable` allowlists
- [x] Server-side **pricing engine** (Catalog `PricingService` + `ProductObserver`)
- [x] Status enums (order/payment/shipping/custom) implementing `HasLabel`
- [x] Shared services: `MediaService` (secure uploads), `AuditLogger`, `StoreSettings`
- [x] Seeders: silver types, categories, 14 demo products, payment methods, pages/FAQ/banner, settings
- [x] Public APIs + API Resources + Form Requests (products, categories, silver-types,
      home, faqs, pages, contact, checkout validate/place-order, order track,
      custom-request submit/track, payment-methods)
- [x] Bilingual strategy: paired `*_ar` columns on translatable fields
- [x] API tests (StorefrontApiTest) — all green

## Phase 3 — Admin Dashboard  ✅ complete
- [x] Filament resources: Product (images/variants/pricing), Category, SilverType,
      Order, CustomRequest (+quote), Customer, PaymentMethod, Support, Page, Faq, Banner, AuditLog
- [x] Per-resource permission gating (`AuthorizesWithPermission`)
- [x] Dashboard widgets: business stats + orders-by-status chart
- [x] Read-only audit log; customers excluded from admin (403) — smoke tests green

## Phase 4 — Public Website UI  ✅ complete
- [x] Home (real data), shop listing (search/filter/sort/pagination), category, product details
- [x] Cart, checkout (server-validated order placement), order success
- [x] Track order, custom order (image upload), custom-request tracking
- [x] About, contact, FAQ, privacy, terms, returns, silver-care
- [x] Loading/empty/error states, toasts; responsive; SEO metadata per route

## Phase 5 — Order Workflow  🔄 mostly done (pulled forward)
- [x] Cart (client) + checkout, **server-side** pricing & totals, order creation,
      order-code generation, status history, payment selection, admin editing, tracking
- [ ] Payment-proof upload (customer) + admin proof review flow
- [ ] Coupons (optional)

## Phase 6 — Custom Silver Workflow  🔄 mostly done (pulled forward)
- [x] Submit request + secure image upload, tracking code, admin review/quote
- [ ] Customer accept/reject quote in-app; convert-request-to-order action (admin)

## Phase 7 — Profile & Customer Account
- [ ] Register/login/logout (API + UI), profile, addresses, order & request history,
      change password, wishlist

## Phase 8 — Security & Validation Pass
- [ ] Forms, uploads, authorization, permissions, rate limiting, error handling,
      privacy pages, debug-leak removal

## Phase 9 — UI Polish & Production Readiness
- [ ] Design/responsiveness/states polish, SEO metadata, sitemap/robots
- [ ] Final README/deploy/test checklist
