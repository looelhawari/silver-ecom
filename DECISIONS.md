# Decision Log

Architecture decisions, most recent first.

## ADR-011 — Client cart + server-authoritative checkout
**2026-07-01.** The cart lives client-side (Zustand, localStorage) for speed, but it
is never trusted for money. At checkout the client sends only `{product_id, variant_id,
quantity}`; the server (`CheckoutService`) recomputes every line price, subtotal,
shipping and total from the database and validates stock inside a transaction. This
avoids server-side cart persistence while keeping pricing tamper-proof.

## ADR-010 — Order/custom backend pulled forward
**2026-07-01.** The user asked to build 3 phases per batch. To avoid shipping broken
Phase 4 pages, the essential Phase 5/6 backend (order placement, order/custom tracking,
custom-request submission with image upload) was implemented in this batch. Deferred:
payment-proof upload/review, in-app quote accept/reject, convert-to-order, customer auth.

## ADR-009 — Status enums implement Filament `HasLabel`
**2026-07-01.** Order/payment/shipping/custom-order status enums implement Filament's
`HasLabel` so selects and badge columns work directly from the enum cast. This couples
the domain enums to Filament (an accepted, admin-only cross-cutting dependency) in
exchange for far less admin boilerplate.

## ADR-008 — Centralized migrations
**2026-07-01.** Migrations live in `database/migrations` (not per-module) so cross-module
foreign keys have deterministic ordering via sequential timestamps. Models, services,
controllers and Filament resources remain module-owned.

## ADR-007 — MySQL as the working database
**2026-07-01.** Switched dev + prod to MySQL (Laragon `fidda_silver`) at the user's
request. `.env.example` documents the connection; the schema stays portable (tests run
on in-memory SQLite).

## ADR-006 — Clean recreate in place (keep installed deps)
**2026-07-01.** Phase 1 already existed as a generic "White Label Commerce" template
with the correct stack installed. Rather than deleting and re-downloading identical
dependencies, we **kept `vendor/` and `node_modules/`** and the good config-driven
frontend skeleton, then cleanly rebuilt: trimmed modules, retargeted branding to
silver jewelry, fixed git, added Filament, rewrote docs. Rationale: the governing
spec says *"use this recommended stack unless there is already an existing stack"* —
the existing stack matched, so reuse was correct and ~20 min faster.

## ADR-005 — Brand placeholder "Fidda Silver"
**2026-07-01.** No brand name was supplied. Chose **Fidda** (فِضّة, Arabic for
*silver*) as a real, professional, bilingual-friendly default — not lorem ipsum.
Everything is config-driven (`backend/.env`, `config/white_label.php`,
`frontend/src/config/*`), so rebranding is a one-place change.

## ADR-004 — SQLite for dev, MySQL for production
**2026-07-01.** Local dev uses SQLite (zero-config, no DB server on dev machines);
production targets MySQL 8. `.env` defaults to SQLite; `.env.example` documents the
MySQL switch. Migrations stay portable across both.

## ADR-003 — Lean, spec-aligned module set
**2026-07-01.** Reduced the inherited 33-module skeleton to **17 modules** matching
the silver-jewelry domain (dropped Brands, Collections, Compare, Inventory, Reviews,
Returns, Notifications, Reports, Import/Export, etc.; folded Products/Categories/
SilverTypes into **Catalog**, Customers into **Users**; added **CustomOrders**).
Module folders carry a `Docs/README.md` charter; code folders are created
just-in-time per phase (no empty scaffolding).

## ADR-002 — Filament for the admin panel
**2026-07-01.** Admin dashboard uses Filament v4 at `/admin`, brand color silver/
slate. Access is **role-gated** by `User::canAccessPanel()` so customers can't reach
it in any environment.

## ADR-001 — Modular monolith
One Laravel backend + one Next.js frontend + one database, internally divided into
modules with clear ownership and a route auto-loader. Not microservices (avoids ops
overhead), not an unstructured monolith (avoids tangle).
