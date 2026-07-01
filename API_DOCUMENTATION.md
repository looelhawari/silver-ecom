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

## Authenticated & workflow endpoints (Phases 5–7)

**Auth** (bearer token via Sanctum):
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register` | none · throttled |
| POST | `/api/v1/auth/login` | none · throttled |
| POST | `/api/v1/auth/logout` | token |
| GET | `/api/v1/auth/me` | token |
| POST | `/api/v1/auth/forgot-password` | none · throttled |
| POST | `/api/v1/auth/reset-password` | none · throttled |

Include `Authorization: Bearer <token>` on protected calls. Password-reset emails
require a configured mail service (dev uses the `log` driver); the reset link targets
the frontend `/reset-password`.

**Account** (token):
| Method | Path | Description |
|--------|------|-------------|
| GET / PATCH | `/api/v1/profile` | View / update profile |
| PATCH | `/api/v1/profile/password` | Change password |
| GET | `/api/v1/profile/orders` | Order history |
| GET | `/api/v1/profile/custom-requests` | Custom request history |
| GET / POST | `/api/v1/addresses` · `/api/v1/addresses/{id}` (PATCH/DELETE) | Address CRUD (owner-only) |
| GET | `/api/v1/wishlist` · POST/DELETE `/api/v1/wishlist/{product}` | Wishlist |

**Order & custom workflow** (guest, code + phone):
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/orders/{code}/payment-proof` | Upload payment proof (multipart) |
| POST | `/api/v1/custom-requests/{code}/accept-quote` | Accept a sent quote |
| POST | `/api/v1/custom-requests/{code}/reject-quote` | Decline a sent quote |

## Still planned / optional

- Password-reset **email delivery** (endpoints exist; needs a mail service).
- Server-generated **invoice PDF** (a printable invoice page is shipped at the
  frontend `/order/invoice`).
- Coupons; server-persisted cart endpoints (the storefront cart is client-side today).

## Conventions

- List endpoints are paginated; responses use `{ data, meta }` (API Resources).
- Rate-limited endpoints: login, register, contact, custom-request,
  track-order, track-custom-request.
- Guest tracking always requires **code + phone**; customers can only access their
  own resources (enforced by Policies).
