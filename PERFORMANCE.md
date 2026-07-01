# Performance

## Backend
- **Pagination** on all list endpoints (products/orders/customers/requests) — never
  load all rows.
- **Indexes** on searchable/filterable columns (slug, sku, status, category_id,
  silver_type_id, created_at, and status/flag composites on `products`/`orders`).
- **Avoid N+1** via eager loading (`with(...)`) on listing/detail endpoints and
  Filament tables.
- **Caching:** `Settings\Services\StoreSettings` caches the key-value settings map
  (5 min); categories/silver-types are cheap and eager-loaded.
- **API Resources** keep payloads lean; **DB transactions** wrap checkout/order and
  custom-order creation.
- **Queues** (DB driver in dev; Redis recommended in prod) ready for email/notifications.

## Frontend
- **Server Components fetch data** (home, product, category, content, FAQ) → good SEO
  and no client waterfall; **client components** only where interactive (cart,
  checkout, account, shop filters, homepage motion).
- `next/image` everywhere: `priority` only on the hero; `loading="lazy"` + sized
  `sizes` for below-the-fold/social imagery; remote hosts allowlisted in `next.config.ts`.
- **TanStack Query** caching (`staleTime` 60s, no refetch on focus).
- Route-level code splitting via the App Router; static prerender where the route has
  no per-request data.
- **Locale splitting:** next-intl loads only the active message catalog (`en` or
  `ar-EG`) per request; the language switcher preserves the current URL without
  fetching both languages.

## Homepage animation performance (interactive but light)
- **No animation library beyond `motion`** (already used) + plain CSS keyframes.
- All motion is **transform/opacity only** (GPU-composited) — marquee, aurora glow,
  shine sweep, Ken-Burns hero zoom, card hover, reveals.
- **No per-frame React re-renders:** the cursor tilt, card spotlight, and top
  scroll-progress bar write straight to the DOM (`style.transform` / CSS vars);
  scroll/resize listeners are `passive`.
- **Count-up** runs once via `IntersectionObserver` + a single `requestAnimationFrame`
  loop; the **typing** effect is one `setTimeout` chain.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` calms the large
  ambient effects (glow/shine/hero-zoom); the subtle brand motion (marquee, caret,
  typing) still runs. See [DECISIONS.md](DECISIONS.md) ADR-013.
- No layout shift: the hero SSRs the first typed phrase; counters start at a stable value.

## Current status
- Frontend `npm run lint`: ✓ clean.
- Frontend `npm run build`: ✓ clean, TypeScript ✓, locale-prefixed routes.
- Backend `php artisan test`: ✓ 21 passed / 101 assertions.
- SEO: dynamic `sitemap.xml` + `robots.txt`, per-route metadata, single H1 on the homepage.
