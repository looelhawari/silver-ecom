# Changelog

All notable changes per phase.

## [Homepage redesign] — 2026-07-01 — Luxury homepage

Rebuilt the homepage as a cinematic, luxury silver-jewelry experience (17 sections,
reusable components, backend-ready data layer).

### Sections
Cinematic hero (floating detail cards) → trust strip → category showcase → signature
collections (editorial bento) → featured products (best-sellers/new/featured tabs) →
custom-order story (upload→quote mockup) → pricing transparency (live estimate
calculator) → why buy → order-tracking timeline → manual-payment trust → reviews →
social showcase → FAQ preview → final CTA.

### Components & data
- `src/config/homepageData.ts` — API-ready content service (announcements, hero,
  collections, steps, reviews, FAQ, calculator config, social).
- `src/components/home/*` — Reveal, SectionHeader, TrustBadge, CategoryCard,
  CollectionTile, icons + all section components.
- Upgraded **LuxuryNavbar** (glass sticky, scroll-aware, WhatsApp CTA, mobile
  slide-over), rotating **AnnouncementBar**, and **PremiumFooter** (newsletter →
  contact endpoint, payment/social/policy links).
- Premium web fonts already active (Cormorant Garamond + Inter).

### Animations / responsive / SEO / a11y
- Motion: hero entrance + floating cards, scroll-reveal wrapper, timeline stagger,
  card hover zoom — kept subtle and lightweight.
- Mobile-first: horizontal-scroll categories, responsive bento, stacked hero.
- Homepage metadata (absolute title + description + OG); single H1; semantic sections;
  lazy-loaded below-the-fold imagery; alt text; keyboard-accessible nav.

### Verified
- `npm run build` clean (29 routes); homepage SSRs all sections + live featured products.

## [Completeness pass] — 2026-07-01 — Master-prompt gap closure

Audited the build against the master prompt and closed the remaining gaps:

### Admin
- **Store Settings page** (`/admin/manage-store-settings`): website name, support
  email/WhatsApp, shipping base cost + free-shipping threshold, VAT, order/invoice
  prefixes, public display toggles (weight/workmanship/gram price), maintenance mode
  — persisted to the `settings` table (cache flushed, audit-logged), permission-gated.
- **Customer detail relation managers**: a customer's Orders, Custom Requests, and
  Admin Notes now show on the Filament customer page (notes are add-able).
- **Dashboard**: added a *Confirmed orders* stat, a **Recent orders** table widget,
  and a **Revenue (14-day)** line chart.
- **Audit logging broadened**: product create/update/delete, silver gram-price
  changes, settings updates, and admin-panel logins (added to the existing order
  status-change logging).

### Storefront
- Shop listing now exposes **price range** and **weight range** filters (the API
  already supported them).
- Product detail gains a **Share** button (Web Share API + clipboard fallback).
- Home page gains a **customer-support + social** section.

### Verified
- Backend `php artisan test` → **20 passed / 94 assertions** (added customer
  edit-page + relations render test).
- Frontend `npm run build` clean; storefront + gated admin settings confirmed at runtime.

## [Phases 8–9] — 2026-07-01 — Security & Production Readiness

### Security (Phase 8)
- CORS locked to the storefront origin (`config/cors.php`, credentials-aware) —
  no more `*`; `CORS_ALLOWED_ORIGINS` env for production.
- `SecurityHeaders` middleware (X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, X-Permitted-Cross-Domain-Policies) applied globally.
- Password reset: `POST /auth/forgot-password` + `/auth/reset-password`
  (anti-enumeration response; reset link points to the Next.js `/reset-password`).
- Confirmed: JSON errors for `/api/*`, Form Requests + rate limits, admin role-gate,
  owner-only records, guest tracking by code + phone.

### Polish & production (Phase 9)
- Premium web fonts via `next/font` (Cormorant Garamond headings, Inter body).
- Metadata title template; dynamic `sitemap.xml` (static + products + categories)
  and `robots.txt` (private routes disallowed).
- Announcement bar; custom `not-found`, `error` boundary, `loading` states.
- Printable **invoice** page (`/order/invoice`) linked from order tracking.
- Frontend `/forgot-password` and `/reset-password` pages.

### Verified
- Backend `php artisan test` → **19 passed / 92 assertions**.
- Frontend `npm run build` clean (**29 routes**; fonts fetched).
- CORS returns the specific origin + credentials; security headers present;
  new pages + sitemap/robots return 200 end-to-end.

## [Phases 5–7] — 2026-07-01 — Orders, Custom Workflow & Accounts

### Order workflow (Phase 5)
- Payment-proof upload API (`POST /orders/{code}/payment-proof`, code + phone verified,
  image/PDF validated) → sets payment status to *Proof Uploaded*.
- Filament Order form now shows the uploaded proof with an approve/reject control.
- `OrderObserver` auto-records every order/payment/shipping status change to the
  status history **and** the audit log.

### Custom workflow (Phase 6)
- Customer accept/reject quote (`POST /custom-requests/{code}/accept-quote|reject-quote`).
- Admin **Convert to order** action on the custom request page (`ConvertToOrder` action);
  shared `OrderCode` helper (refactored out of `CheckoutService`).
- Custom-tracking page shows Accept/Decline when a quote is sent.

### Customer accounts (Phase 7)
- Sanctum **token auth**: register/login/logout/me; `apiFetch` attaches the bearer
  token; frontend `useAuthStore` + `loadMe()` on boot.
- Profile view/update, change password; address CRUD (IDOR-guarded); order &
  custom-request history; wishlist (API + page + product-detail + header).
- Frontend: `/login`, `/register`, `/account` (profile + password + addresses),
  `/account/orders`, `/account/requests`, `/wishlist`; header shows account/wishlist.

### Images (interim)
- Seeded real jewelry photos via LoremFlickr (keyword + stable `lock`) for product
  main images, product galleries, and categories; allowed image hosts in `next.config`.

### Verified
- Backend `php artisan test` → **19 passed / 92 assertions** (added auth, profile,
  address IDOR, wishlist, payment-proof, quote-accept, convert-to-order).
- Frontend `npm run build` clean (24 routes); new pages return 200 end-to-end.

## [Phases 2–4] — 2026-07-01 — Data, Admin & Storefront

### Database & backend (Phase 2)
- Switched to **MySQL** (Laragon, `fidda_silver`); 11 domain migrations (catalog,
  users+addresses, payments, cart, orders, custom orders, content, support, wishlist, audit).
- Eloquent models across modules with relationships/casts/fillable; status enums
  (order/payment/shipping/custom) with labels.
- **Server-side pricing engine** (`PricingService` + `ProductObserver`) so
  `final_price` is always authoritative.
- Shared services: `MediaService` (validated, renamed uploads), `AuditLogger`, `StoreSettings` (cached).
- Seeders: 5 silver types, 9 categories, 14 demo products (+ring variants), 4 payment
  methods, 5 pages, FAQs, hero banner, store settings.
- Public REST APIs + Resources + Form Requests: products (filter/sort/paginate),
  product detail (+related), categories, silver-types, home, faqs, pages, contact,
  checkout validate/place-order, order track, custom-request submit/track, payment-methods.
- Rate limiting on contact/checkout/track/custom endpoints; guest tracking requires code + phone.

### Admin dashboard (Phase 3)
- 12 Filament v4 resources (Product with image/variant repeaters + pricing, Category,
  SilverType, Order, Custom Request with hasOne quote, Customer, PaymentMethod,
  Support, Page, Faq, Banner, read-only AuditLog) grouped in nav.
- Per-resource permission gating via `AuthorizesWithPermission`; dashboard stats +
  orders-by-status chart widgets.

### Storefront (Phase 4)
- Pages: home (real data), shop (filters/sort/search/pagination), category, product
  detail (SEO metadata), cart, checkout (server-validated order placement), order
  success, track order, custom order (image upload), custom tracking, contact, FAQ,
  about + 4 policy pages.
- Persistent cart (Zustand), live header cart count, product cards, toasts,
  loading/empty/error states, `next/image` remote-pattern config.

### Verified
- Backend: `php artisan test` → **12 passed / 60 assertions** (admin smoke incl.
  customer-403, storefront APIs, IDOR + out-of-stock guards, custom orders, contact).
- Frontend: `npm run build` clean (18 routes, TypeScript ✓).
- End-to-end: home page SSRs live products from the API; `/shop` 200.

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
