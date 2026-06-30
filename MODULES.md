# Modules

The backend is divided into business modules under `backend/app/Modules/*`. The
authoritative list and registration order live in
[`ModuleRegistry`](backend/app/Support/Modules/ModuleRegistry.php). Each module
ships a `Docs/README.md` charter from Phase 1; code folders are added in the
module's implementation phase (no empty scaffolding).

## Module map

| Module | API prefix | Responsibility | Key planned tables |
|--------|-----------|----------------|--------------------|
| **Core** | `/api/v1` | Health check, shared kernel | — |
| **AccessControl** | — | Roles & permissions (Spatie); 5 admin roles | roles, permissions |
| **Auth** | — | Sanctum register/login/logout/me, password reset | personal_access_tokens |
| **Users** | — | Customer & admin accounts, profiles, addresses, admin notes | users, user_addresses |
| **Catalog** | — | Products, categories, silver types, variants, images, **pricing engine** | products, product_images, product_variants, categories, silver_types |
| **Cart** | — | Server-validated cart (guest + user) | carts, cart_items |
| **Checkout** | — | Checkout validation & order placement (orchestrator) | — |
| **Orders** | — | Orders, items, status history, invoices | orders, order_items, order_status_history |
| **Payments** | — | Manual methods (COD/Vodafone Cash/InstaPay/bank), proof review | payment_methods, payment_proofs |
| **Shipping** | — | Address, manual cost, status, tracking | shipping_addresses |
| **CustomOrders** | — | Custom silver requests, images, quotes, convert-to-order | custom_order_requests, custom_order_images, custom_order_quotes |
| **Wishlist** *(optional)* | — | Customer wishlist | wishlists, wishlist_items |
| **Content** | — | Banners, homepage sections, pages, FAQ, footer links | pages, faqs, banners, homepage_sections |
| **Support** | — | Contact/support messages | support_messages |
| **Media** | — | Shared secure file upload/storage service | media *(optional)* |
| **AuditLogs** | — | Append-only admin action audit trail | audit_logs |
| **Settings** | `/api/v1/storefront` | Store/SEO/theme/payment/shipping settings, feature flags | settings, *_settings |

A `—` API prefix means the module has no public routes yet; they are added in its
phase. Only **Core** (`/api/v1/health`) and **Settings**
(`/api/v1/storefront/config`) expose routes in Phase 1.

## Boundary rules

1. **One owner per concern.** A table is owned by exactly one module; other modules
   reach it only through that module's Services/Actions or events.
2. **No cross-module model reach-ins** from controllers — go through the public
   service layer.
3. **Cross-cutting services:** file storage → `Media`; audit trail → `AuditLogs`.
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
