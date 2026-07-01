# API Documentation

- **Base URL:** `/api/v1`
- **Format:** JSON. Send `Accept: application/json`.
- **Auth:** Laravel Sanctum (SPA cookie session and/or bearer tokens).
- **Versioning:** path-based (`/api/v1`). Module routes auto-register under their
  prefix (see [MODULES.md](MODULES.md)).

## Available now (Phases 1–4)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api` | none | API index |
| GET | `/api/v1/health` | none | Health check |
| GET | `/api/v1/storefront/config` | none | Public storefront config |
| GET | `/sanctum/csrf-cookie` | none | CSRF cookie for SPA auth |
| GET | `/api/v1/products` | none | Product list — filters `q, category, silver_type, price_min/max, weight_min/max, featured, best_sellers`, `sort=newest\|price_asc\|price_desc\|best_sellers`, paginated |
| GET | `/api/v1/products/{slug}` | none | Product detail + `meta.related` |
| GET | `/api/v1/categories` | none | Active categories (with product counts) |
| GET | `/api/v1/categories/{slug}` | none | Category + first page of products |
| GET | `/api/v1/silver-types` | none | Active silver types |
| GET | `/api/v1/home` | none | Home aggregate (banners, featured categories/products, best sellers, new arrivals) |
| GET | `/api/v1/faqs` | none | Active FAQs |
| GET | `/api/v1/pages/{slug}` | none | Published CMS page |
| GET | `/api/v1/payment-methods` | none | Active payment methods |
| POST | `/api/v1/checkout/validate` | none | Server-side price/total preview for a cart |
| POST | `/api/v1/checkout/place-order` | none · throttled | Create an order (server-computed totals) |
| POST | `/api/v1/orders/track` | none · throttled | Track order by `order_code` + `phone` |
| POST | `/api/v1/custom-requests` | none · throttled | Submit a custom silver request (multipart `images[]`) |
| POST | `/api/v1/custom-requests/track` | none · throttled | Track custom request by `request_code` + `phone` |
| POST | `/api/v1/contact` | none · throttled | Submit a contact message |

### Examples

```bash
curl http://localhost:8000/api/v1/health
curl "http://localhost:8000/api/v1/products?sort=price_asc&category=rings"
curl -X POST http://localhost:8000/api/v1/checkout/validate \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"items":[{"product_id":1,"quantity":2}]}'
```

Guest tracking always requires **code + phone** — an order/request code alone cannot
reveal a record (verified by tests). List endpoints return `{ data, meta }`.

## Planned endpoints (later phases)

**Auth (Phase 7)** — `POST /auth/register|login|logout`, `GET /auth/me`,
`POST /auth/forgot-password|reset-password`.

**Profile (Phase 7)** — `GET/PATCH /profile`, `GET /profile/orders`,
`GET /profile/custom-requests`, `PATCH /profile/password`.

**Payments (Phase 5)** — `POST /orders/{code}/payment-proof` (upload proof).

**Custom quote actions (Phase 6)** — `POST /custom-requests/{code}/accept-quote|reject-quote`.

**Wishlist (optional)** — `GET /wishlist`, `POST/DELETE /wishlist/{product}`.

**Orders (Phase 6/7)** — `GET /orders`, `GET /orders/{id}`,
`POST /orders/track` (order code + phone), `GET /orders/{id}/invoice`.

**Custom orders (Phase 6)** — `POST /custom-requests`,
`POST /custom-requests/track` (code + phone),
`POST /custom-requests/{id}/accept-quote`, `.../reject-quote`.

**Profile (Phase 7)** — `GET /profile`, `PATCH /profile`,
`GET /profile/orders`, `GET /profile/custom-requests`, `PATCH /profile/password`.

**Content/Support (Phase 4/8)** — `GET /faqs`, `GET /pages/{slug}`,
`POST /contact`.

**Wishlist (optional)** — `GET /wishlist`, `POST /wishlist/{product}`,
`DELETE /wishlist/{product}`.

## Conventions (planned)

- List endpoints are paginated; responses use `{ data, meta }` (API Resources).
- Rate-limited endpoints: login, register, contact, custom-request,
  track-order, track-custom-request.
- Guest tracking always requires **code + phone**; customers can only access their
  own resources (enforced by Policies).
