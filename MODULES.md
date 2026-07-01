# Modules

The backend is divided into business modules under `backend/app/Modules/*`. The
authoritative list and registration order live in
[`ModuleRegistry`](backend/app/Support/Modules/ModuleRegistry.php). Each module
ships a `Docs/README.md` charter from Phase 1; code folders are added in the
module's implementation phase (no empty scaffolding).

## Module map

Public API routes live at `/api/v1/*`; `auth` and `storefront` are sub-prefixes.
`—` = no HTTP routes (admin-only via Filament, or a shared service).

| Module | API routes | Responsibility | Key tables |
|--------|-----------|----------------|-----------|
| **Core** | `/health` | Health check, shared kernel | — |
| **AccessControl** | — | Roles & permissions (Spatie); 5 admin roles | roles, permissions |
| **Auth** | `/auth/*` | Register/login/logout/me, forgot/reset password | personal_access_tokens |
| **Users** | `/profile*`, `/addresses*` | Accounts, profile, addresses, admin notes | users, user_addresses, user_admin_notes |
| **Catalog** | `/products*`, `/categories*`, `/silver-types`, `/home` | Products, categories, silver types, variants, images, **pricing engine** | products, product_images, product_variants, categories, silver_types |
| **Cart** | — (client cart) | Cart models for future server carts | carts, cart_items |
| **Checkout** | `/checkout/*`, `/payment-methods` | Server-side totals & order placement | — |
| **Orders** | `/orders/track`, `/orders/{code}/payment-proof` | Orders, items, status history, invoices | orders, order_items, order_status_history |
| **Payments** | (via Orders/Checkout) | Manual methods (COD/Vodafone Cash/InstaPay/bank), proof review | payment_methods, payment_proofs |
| **Shipping** | — | Address, manual cost, status, tracking | shipping_addresses |
| **CustomOrders** | `/custom-requests*` | Custom requests, images, quotes, convert-to-order | custom_order_requests, custom_order_images, custom_order_quotes |
| **Wishlist** | `/wishlist*` | Customer wishlist | wishlist_items |
| **Content** | `/pages/{slug}`, `/faqs` | Banners, pages, FAQ | pages, faqs, banners |
| **Support** | `/contact` | Contact/support messages | support_messages |
| **Media** | — | Shared secure file upload/storage service | (uses disks) |
| **AuditLogs** | — | Append-only admin action audit trail | audit_logs |
| **Settings** | `/storefront/config` | Store/SEO/theme/payment settings, feature flags | settings, *_settings |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for the full endpoint list and auth
requirements. Homepage "sections" are driven by product flags + banners (no dedicated table).

## Boundary rules

1. **One owner per concern.** A table is owned by exactly one module; other modules
   reach it only through that module's Services/Actions or events.
2. **No cross-module model reach-ins** from controllers — go through the public
   service layer.
3. **Cross-cutting services:** file storage → `Media`; audit trail → `AuditLogs`;
   localized display fields/statuses → `App\Support\Localization`.
4. **Money is server-side only** — `Catalog` computes product prices, `Checkout`
   computes order totals; the client is never trusted.
5. **Routes are auto-registered** by `ModuleServiceProvider` from each module's
   `Routes/api.php`; add a route file + a non-null prefix in the registry to expose it.

## Adding a module

1. Add a `ModuleDefinition` entry to `ModuleRegistry`.
2. Create `app/Modules/<Name>/Docs/README.md` (charter).
3. Add code folders (`Http`, `Models`, `Services`, …) as you implement.
4. If it has an API, add `Routes/api.php` and a non-null prefix.
5. Document tables in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) and endpoints in
   [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
