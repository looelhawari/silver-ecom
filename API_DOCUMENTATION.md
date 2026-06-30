# API Documentation

- **Base URL:** `/api/v1`
- **Format:** JSON. Send `Accept: application/json`.
- **Auth:** Laravel Sanctum (SPA cookie session and/or bearer tokens).
- **Versioning:** path-based (`/api/v1`). Module routes auto-register under their
  prefix (see [MODULES.md](MODULES.md)).

## Available now (Phase 1)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api` | none | API index (name, status, version) |
| GET | `/api/v1/health` | none | Health check (status, service, env, timestamp) |
| GET | `/api/v1/storefront/config` | none | Public storefront config (store, contact, theme, SEO, features, integrations) |
| GET | `/sanctum/csrf-cookie` | none | CSRF cookie for SPA auth |

### Example

```bash
curl http://localhost:8000/api/v1/health
# { "status":"ok", "service":"Fidda Silver", "environment":"local", "timestamp":"..." }
```

## Planned endpoints (per phase)

> Documented here as the contract; implemented in the listed phase.

**Catalog (Phase 5)** — `GET /products`, `GET /products/{slug}`,
`GET /categories`, `GET /categories/{slug}`, `GET /silver-types`, `GET /home`.

**Auth (Phase 7)** — `POST /auth/register`, `POST /auth/login`,
`POST /auth/logout`, `GET /auth/me`, `POST /auth/forgot-password`,
`POST /auth/reset-password`.

**Cart (Phase 5/6)** — `GET /cart`, `POST /cart/items`,
`PATCH /cart/items/{id}`, `DELETE /cart/items/{id}`.

**Checkout (Phase 6)** — `POST /checkout/validate`, `POST /checkout/place-order`.

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
