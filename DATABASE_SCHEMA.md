# Database Schema

- **Production:** MySQL 8. **Local dev:** SQLite (`backend/database/database.sqlite`).
- Conventions: snake_case tables/columns, `id` big-increment PKs, `created_at`/
  `updated_at` timestamps, foreign keys with sensible `on delete` behaviour.
- **Bilingual content:** translatable fields (product/category names, descriptions,
  page content) will store EN/AR — strategy decided in Phase 2 (JSON columns vs.
  paired `*_en`/`*_ar` columns). The schema must not assume English-only.

## Current tables (Phase 1)

Created by Laravel defaults + Sanctum + Spatie + the white-label settings migration:

| Table | Source | Notes |
|-------|--------|-------|
| `users` | Laravel | Customers and admins; roles via Spatie |
| `password_reset_tokens` | Laravel | Password resets |
| `sessions` | Laravel | DB session driver |
| `cache`, `cache_locks` | Laravel | DB cache store |
| `jobs`, `job_batches`, `failed_jobs` | Laravel | Queue (DB driver) |
| `personal_access_tokens` | Sanctum | API tokens |
| `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` | Spatie | RBAC |
| white-label settings tables | Settings module | Store/theme/SEO/payment/shipping settings (`2026_06_30_133000_create_white_label_settings_tables`) |

### Seeded data (Phase 1)

- **Roles:** `super-admin`, `staff`, `order-manager`, `content-manager`, `product-manager`.
- **Permissions:** coarse `*.manage` / `*.view` set (see `RolesAndPermissionsSeeder`).
- **Super-admin user** from `ADMIN_*` env vars.

## Planned tables (Phase 2+)

Owned per module (see [MODULES.md](MODULES.md)):

- **Catalog:** `categories`, `silver_types`, `products`, `product_images`,
  `product_variants`.
- **Cart:** `carts`, `cart_items`.
- **Orders:** `orders`, `order_items`, `order_status_history`.
- **Payments:** `payment_methods`, `payment_proofs`.
- **Shipping:** `shipping_addresses`.
- **CustomOrders:** `custom_order_requests`, `custom_order_images`, `custom_order_quotes`.
- **Users:** `user_addresses`, `user_admin_notes`.
- **Content:** `pages`, `faqs`, `banners`, `homepage_sections`.
- **Support:** `support_messages`.
- **Wishlist** *(optional)*: `wishlists`, `wishlist_items`.
- **AuditLogs:** `audit_logs`.

### Pricing columns (Catalog `products`, Phase 2)

`pricing_type` (`fixed`|`calculated`), `fixed_price`, `silver_type_id`,
`weight_in_grams`, `gram_price_snapshot`, `workmanship_fee`, `extra_markup`,
`discount_amount`, `discount_percentage`, `manual_price_override`, `final_price`,
`show_workmanship_fee_publicly`.

> `final_price = (silver_gram_price × weight_in_grams) + workmanship_fee + extra_markup − discount`,
> computed server-side, overridable by admin.

## Key relationships (planned)

- Product → Category (belongsTo), Product → SilverType (belongsTo),
  Product → ProductImages (hasMany), Product → ProductVariants (hasMany).
- Order → User (belongsTo, nullable for guest), Order → OrderItems (hasMany),
  Order → OrderStatusHistory (hasMany), Order → ShippingAddress (hasOne),
  Order → PaymentProof (hasOne/optional).
- CustomOrderRequest → User (nullable), → CustomOrderImages (hasMany),
  → CustomOrderQuote (hasOne); convertible to an Order.
