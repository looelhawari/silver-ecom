# Security

Security is a first-class requirement. This file lists the controls in place and
the per-phase checklist. A dedicated hardening pass happens in **Phase 8**.

## In place (Phase 1)

- **Admin access control:** `User::canAccessPanel()` restricts `/admin` to admin
  roles only; storefront customers are rejected in every environment (not just
  local). Super-admin bypasses gates via `Gate::before` (see `AppServiceProvider`).
- **RBAC:** Spatie roles/permissions seeded (`super-admin`, `staff`,
  `order-manager`, `content-manager`, `product-manager`).
- **Secrets:** only in `.env` (git-ignored). `.env.example` ships placeholders.
  Admin credentials are seeded from env vars, never hardcoded.
- **Password hashing:** bcrypt (cost 12) via Laravel + `password` cast.
- **Auth foundation:** Sanctum installed; `SANCTUM_STATEFUL_DOMAINS` scoped to the
  frontend origin.
- **ORM:** Eloquent/query builder everywhere (parameterized) — no raw string SQL.
- **Mass assignment:** `User` uses an explicit `#[Fillable]` allowlist.
- **Frontend:** secrets are server-only; only `NEXT_PUBLIC_*` values reach the
  browser. API client sets `credentials: 'include'` for Sanctum and surfaces typed
  errors without leaking internals.

## Planned controls (by phase)

| Threat | Control | Phase |
|--------|---------|-------|
| Price/total tampering | Server-side pricing engine + checkout totals | 5–6 |
| IDOR / broken access | Policies; customers see only their own records | 6–8 |
| Guest data exposure | Order/custom-request tracking requires code + phone | 6 |
| File upload abuse | MIME+extension validation, size limits, rename, off-webroot storage (Media) | 6 |
| Brute force | Rate limits on login/register/contact/track/custom-request | 7–8 |
| Mass assignment | Form Requests + `$fillable` allowlists on every model | 2+ |
| CSRF | Sanctum CSRF for stateful SPA; tokens for API | 7 |
| XSS | React escaping + sanitized rich content | 4+ |
| Sensitive errors | `APP_DEBUG=false` + generic error pages in production | 8 |
| Privilege escalation | Per-resource permission checks on Filament resources | 3 |
| Audit | `audit_logs` for product/order/price/quote/gram-price/settings/login changes | 3+ |
| Insecure CORS | Restrict CORS to the frontend origin | 8 |

## Production must-do (see DEPLOYMENT.md)

- `APP_DEBUG=false`, `APP_ENV=production`, fresh `APP_KEY`.
- HTTPS only; secure, http-only, same-site cookies.
- Change seeded `ADMIN_*` credentials.
- Lock down storage permissions; serve uploads safely.
