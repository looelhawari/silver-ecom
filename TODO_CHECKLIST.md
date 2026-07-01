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

## Phase 5 — Order Workflow  ✅ complete
- [x] Cart (client) + checkout, **server-side** pricing & totals, order creation,
      order-code generation, status history, payment selection, admin editing, tracking
- [x] Payment-proof upload (API + UI on success/track) + Filament admin proof review
- [x] Order status auto-logged to history + audit log (OrderObserver)
- [ ] Coupons (optional, deferred)

## Phase 6 — Custom Silver Workflow  ✅ complete
- [x] Submit request + secure image upload, tracking code, admin review/quote
- [x] Customer accept/reject quote in-app (API + UI)
- [x] Admin convert-request-to-order action (Filament)

## Phase 7 — Profile & Customer Account  ✅ complete
- [x] Register/login/logout (Sanctum token API + UI)
- [x] Profile view/update, change password
- [x] Address CRUD (IDOR-guarded), order history, custom-request history
- [x] Wishlist (API + page + product-detail + header)
- [x] Forgot/reset password email flow (Brevo-ready SMTP transactional mail)

## Images (interim)
- [x] Real jewelry photos (LoremFlickr, keyword + stable lock) seeded for products
      (main + gallery) and categories; `next.config` remote hosts allowed.
      Replace with real uploads via the admin panel.

## Phase 8 — Security & Validation Pass  ✅ complete
- [x] CORS restricted to the frontend origin (credentials-aware, not `*`)
- [x] Security headers middleware (nosniff, frame-options, referrer-policy)
- [x] Password reset flow (forgot/reset API → frontend link; anti-enumeration)
- [x] JSON error rendering for `/api/*`; Form Requests + rate limits everywhere
- [x] Authorization confirmed: admin role-gate, owner-only records, guest code+phone
- [x] Real mail service wiring for password-reset emails (Brevo-ready SMTP; dev uses `log`)

## Phase 9 — UI Polish & Production Readiness  ✅ complete
- [x] Premium web fonts (Cormorant Garamond headings + Inter body) via next/font
- [x] Metadata title template; per-route SEO; dynamic `sitemap.xml` + `robots.txt`
- [x] Announcement bar; custom 404, error boundary, loading states
- [x] Printable invoice page (`/order/invoice`)
- [x] Deployment guide, `.env.example`, production checklist (see DEPLOYMENT.md)

## Homepage redesign & interactivity  ✅ complete
- [x] Luxury homepage: 17 reusable sections (hero, trust, categories, collections,
      featured, custom-order story, pricing calculator, why-buy, tracking timeline,
      payment trust, reviews, social, FAQ, final CTA) + config-driven `homepageData.ts`
- [x] Interactive/animated: typing effect, count-up stats, cursor tilt, silver marquee,
      scroll-progress bar, spotlight cards, scroll reveals — GPU-light, reduced-motion aware
- [x] Fixed reduced-motion over-suppression (page no longer appears static)

## Completeness pass (master-prompt gaps)  ✅ complete
- [x] Admin Store Settings page; customer relation managers (orders/requests/notes)
- [x] Dashboard: recent-orders + revenue widgets; broader audit logging
- [x] Shop price/weight filters; product Share button; home support/social section

---

## Localization Phase — Public Website  ✅ complete
- [x] Locale-prefixed routes: `/en` and `/ar-EG`
- [x] next-intl request config, middleware/proxy routing, language switcher
- [x] RTL/LTR document direction and Arabic message catalog
- [x] Customer-facing storefront translated (home, shop, product, cart, checkout,
      auth/account, tracking, custom orders, content pages, success/invoice)
- [x] API locale resolution via `?locale` / `Accept-Language`
- [x] Backend localized fields/status labels with English fallback
- [x] Non-destructive migration for `*_en`/`*_ar` content columns
- [x] Docs updated; tests/build verified
- [ ] Admin dashboard translation/editing UX (deferred to part two by user request)

## Transactional Email Phase — Brevo-ready ✅ complete
- [x] Branded email layout + templates for order invoice, payment confirmation,
      first-login OTP and password reset
- [x] Laravel Mail transactional service with duplicate-send protection
- [x] Checkout sends invoice when `customer_email` is present
- [x] Admin proof approval marks payment approved; confirmation email sends once when
      payment is approved/paid and order is confirmed or beyond
- [x] First-login OTP hash/expiry storage + authenticated verification endpoint
- [x] `.env.example`, API/schema/security/deployment docs updated

**Status: all planned phases complete + homepage redesign + public localization + transactional email.**
Remaining optional/deferred: coupons, invoice **PDF** (printable page shipped),
admin dashboard translation editing UX.
