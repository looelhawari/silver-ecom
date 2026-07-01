# Database Schema

- **Active DB:** MySQL 8 (Laragon `fidda_silver` in dev; MySQL in prod). Tests run on
  in-memory SQLite; migrations are portable.
- **Conventions:** snake_case tables/columns, big-increment `id` PKs,
  `created_at`/`updated_at` timestamps, FKs with sensible `on delete` (cascade for
  owned children, `null` for optional refs).
- **Bilingual content:** translatable fields use **paired columns** — `name`/`name_ar`,
  `description`/`description_ar`, `title`/`title_ar`, `body`/`body_ar`, etc.
- **Statuses** are stored as strings, validated in the app by PHP enums (see
  [DATA_MODELS.md](DATA_MODELS.md)).

## Framework / infra tables
`users` (+ `phone`, `whatsapp`, `is_blocked`, `blocked_at`), `password_reset_tokens`,
`sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`,
`personal_access_tokens` (Sanctum), Spatie RBAC (`roles`, `permissions`,
`model_has_roles`, `model_has_permissions`, `role_has_permissions`), and the
white-label settings set (`settings` [key-value], `theme_settings`, `feature_flags`,
`payment_settings`, `shipping_settings`, `integration_settings`, `seo_settings`).

## Domain tables (by module)

| Module | Tables | Notable columns |
|--------|--------|-----------------|
| Catalog | `silver_types` | name/name_ar, slug, purity, gram_price, gram_price_updated_at, is_active |
| Catalog | `categories` | name/name_ar, slug, description(+_ar), image_path, seo_title/desc, is_active, sort_order |
| Catalog | `products` | name/name_ar, slug, sku, category_id, silver_type_id, weight_in_grams, stock_quantity, **pricing** (pricing_type, fixed_price, gram_price_snapshot, workmanship_fee, extra_markup, discount_amount, discount_percentage, manual_price_override, final_price, show_workmanship_fee_publicly), is_active/is_featured/is_best_seller, main_image_path, tags(json), seo_* |
| Catalog | `product_images` | product_id, path, alt, is_main, sort_order |
| Catalog | `product_variants` | product_id, type, label, value, price_adjustment, stock_quantity, sku |
| Users | `user_addresses` | user_id, label, full_name, phone, whatsapp, city, area, address_line, building/floor/apartment, notes, is_default |
| Users | `user_admin_notes` | user_id, author_id, note |
| Payments | `payment_methods` | code, name/name_ar, instructions(+_ar), account_details, requires_proof, is_active, sort_order |
| Payments | `payment_proofs` | order_id, payment_method_id, file_path, status, reviewed_by, reviewed_at, note |
| Cart | `carts`, `cart_items` | cart: user_id / session_token; item: product_id, product_variant_id, quantity, unit_price_snapshot |
| Orders | `orders` | order_code, user_id, customer_*, status/payment_status/shipping_status, payment_method_id, subtotal/shipping_cost/discount_total/total, currency, tracking_number/courier_name/shipping_note, notes/admin_notes, placed_at |
| Orders | `order_items` | order_id, product_id, product_name/sku, variant_label, silver_type_name, weight_in_grams, unit_price, quantity, line_total |
| Orders | `order_status_history` | order_id, type, status, note, changed_by, visible_to_customer |
| Shipping | `shipping_addresses` | order_id, full_name, phone, whatsapp, city, area, address_line, building/floor/apartment, notes |
| CustomOrders | `custom_order_requests` | request_code, user_id, name/phone/whatsapp/email, description, silver_type_id, expected_weight_grams, size, budget_min/max, notes, status, admin_notes, customer_message, order_id |
| CustomOrders | `custom_order_images` | custom_order_request_id, path |
| CustomOrders | `custom_order_quotes` | custom_order_request_id, estimated_weight_grams, silver_type_id, gram_price, workmanship_fee, extra_cost, final_quote (nullable), message, status, created_by |
| Content | `pages` | slug, title/title_ar, body/body_ar, seo_*, is_published |
| Content | `faqs` | question/answer (+_ar), group, sort_order, is_active |
| Content | `banners` | title/subtitle (+_ar), image_path, link_url, placement, sort_order, is_active, starts_at/ends_at |
| Support | `support_messages` | name, email, phone, subject, message, status, admin_note |
| Wishlist | `wishlist_items` | user_id, product_id (unique pair) |
| AuditLogs | `audit_logs` | user_id, action, auditable_type/id, description, properties(json), ip_address |

> There is no `homepage_sections` table — the homepage's featured sections are driven
> by product flags (`is_featured`/`is_best_seller`), recency (new arrivals), and
> `banners`. `payment_settings` (gateway config) is separate from `payment_methods`
> (the manual methods customers pick).

## Migrations
Laravel/Sanctum/Spatie defaults + `2026_06_30_133000_create_white_label_settings_tables`,
then `2026_07_01_000001..000011` (catalog, users+addresses, payment_methods, cart,
orders, payment_proofs, custom_orders, content, support, wishlist, audit_logs), all in
`backend/database/migrations` (centralized for deterministic FK ordering — see
[DECISIONS.md](DECISIONS.md) ADR-008).

## Seed data (`php artisan migrate --seed`)
Roles + permissions, env-driven super-admin, 5 silver types (with gram prices),
9 categories, 14 demo products (+ ring-size variants, LoremFlickr placeholder images),
4 payment methods, 5 pages + FAQs + a hero banner, and store settings.

## Pricing formula
`final_price = (gram_price × weight_in_grams) + workmanship_fee + extra_markup − discount`
— computed server-side by `PricingService`, persisted via `ProductObserver`, overridable
by `manual_price_override`.
