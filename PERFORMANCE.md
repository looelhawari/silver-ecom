# Performance

## Strategy

### Backend
- **Pagination** for all product/order/customer/request lists — never load all rows.
- **Indexes** on searchable/filterable columns (slug, sku, status, category_id,
  silver_type_id, created_at) — added with each table in Phase 2+.
- **Avoid N+1** via eager loading (`with(...)`) on listing/detail endpoints.
- **Caching** for slow-changing public data (settings, categories, silver types).
- **API Resources** keep payloads lean; transactions wrap checkout/order creation.
- **Queues** (DB driver now; Redis in prod) for future email/notification work.

### Frontend
- Next.js 16 App Router with RSC; static where possible (the Phase 1 home is
  prerendered static).
- `next/image` for optimized, lazy-loaded imagery.
- TanStack Query caching (`staleTime` 60s, no refetch on focus).
- Planned: skeleton loaders, empty/error/success states, infinite/lazy product
  loading, route-level code splitting.

## Current status (Phase 1)
- Frontend production build: ✓ compiles, TypeScript ✓, `/` prerendered static.
- Backend: lean route table; DB cache/queue drivers configured.

A dedicated performance + SEO pass is **Phase 9** (was Phase 14 in the extended
plan): image optimization, query review, caching, sitemap/robots.
