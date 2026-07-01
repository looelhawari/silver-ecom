# Data Models

All domain models are **implemented**. Each model lives in its owning module under
`app/Modules/<Module>/Models`; the framework `User` stays in `app/Models`. Status
enums live under `app/Modules/<Module>/Enums`.

Money is never trusted from the client — see `Catalog\Services\PricingService`
(product prices) and `Checkout\Services\CheckoutService` (order totals).

## Identity

### User — `app/Models/User.php`
- Traits: `HasApiTokens` (Sanctum), `HasRoles` (Spatie), `Notifiable`, `HasFactory`.
- Implements `FilamentUser`; `canAccessPanel()` allows only admin roles and blocks
  `is_blocked` users.
- Columns added beyond Laravel defaults: `phone`, `whatsapp`, `is_blocked`, `blocked_at`,
  first-login OTP hash/expiry/sent/verified timestamps.
- A "customer" is a `User` with **no** admin role (`isCustomer()`).
- Relations: `addresses`, `orders`, `customOrderRequests`, `wishlistItems`, `adminNotes`.
- Roles (Spatie): `super-admin`, `staff`, `order-manager`, `content-manager`, `product-manager`.
- Overrides password-reset notifications to send the branded transactional email through
  Laravel Mail/Brevo SMTP.

## Catalog — `app/Modules/Catalog/Models`
| Model | Key fields | Relationships |
|-------|-----------|---------------|
| `SilverType` | name/name_en/name_ar, slug, purity, `gram_price`, `gram_price_updated_at`, is_active | hasMany Product |
| `Category` | name/name_en/name_ar, slug, description_en/description_ar, image_path, localized seo_*, is_active, sort_order | hasMany Product |
| `Product` | name/name_en/name_ar, slug, sku, description_en/description_ar, care_instructions_en/care_instructions_ar, weight_in_grams, stock_quantity, **pricing fields**, is_active/featured/best_seller, tags, main_image_path, localized seo_* | belongsTo Category & SilverType; hasMany images, variants; hasOne mainImage |
| `ProductImage` | path, alt, is_main, sort_order | belongsTo Product |
| `ProductVariant` | type (ring_size/chain_length/…), label, value, price_adjustment, stock_quantity | belongsTo Product |

- **Pricing fields on Product:** `pricing_type` (`fixed`|`calculated`), `fixed_price`,
  `gram_price_snapshot`, `workmanship_fee`, `extra_markup`, `discount_amount`,
  `discount_percentage`, `manual_price_override`, `final_price`, `show_workmanship_fee_publicly`.
- **`ProductObserver`** recomputes `final_price` on every save and audit-logs CRUD;
  **`PricingService`** holds the formula:
  `final = (gram_price × weight) + workmanship + markup − discount` (override wins).

## Purchase flow
| Model | Module | Relationships / notes |
|-------|--------|-----------------------|
| `Cart`, `CartItem` | Cart | guest (session_token) or user cart; item snapshots unit price. Storefront uses a client cart; server is authoritative at checkout. |
| `Order` | Orders | belongsTo User (nullable/guest); hasMany items, statusHistory; hasOne shippingAddress, paymentProof; `order_code`, totals, `OrderObserver` logs status changes and sends payment-confirmed email once |
| `OrderItem` | Orders | snapshots product_name/sku/silver_type/weight/unit_price/line_total |
| `OrderStatusHistory` | Orders | type (order/payment/shipping), status, note, changed_by, visible_to_customer |
| `ShippingAddress` | Shipping | belongsTo Order; full address + tracking is on the order |
| `PaymentMethod` | Payments | code, name/name_en/name_ar, instructions_en/instructions_ar, account_details, requires_proof, is_active |
| `PaymentProof` | Payments | belongsTo Order & PaymentMethod; file_path, status (pending/approved/rejected), reviewed_by; approving proof marks order payment approved |

Order email timestamps (`invoice_emailed_at`, `payment_confirmed_emailed_at`) prevent
duplicate invoice/confirmation sends when admins edit orders multiple times.

## Custom orders — `app/Modules/CustomOrders/Models`
| Model | Relationships / notes |
|-------|-----------------------|
| `CustomOrderRequest` | belongsTo User (nullable); hasMany images; hasOne quote; `request_code`, status, admin_notes, customer_message, `order_id` (when converted) |
| `CustomOrderImage` | belongsTo request |
| `CustomOrderQuote` | belongsTo request & SilverType; estimated weight, gram price, workmanship, extra cost, `final_quote`, status (draft/sent/accepted/rejected) |
- `Actions\ConvertToOrder` turns an approved request+quote into an `Order`.

## Users extras / Content / Support / Wishlist / Audit
| Model | Module | Notes |
|-------|--------|-------|
| `UserAddress` | Users | belongsTo User; label, full contact + address, is_default |
| `UserAdminNote` | Users | belongsTo User & author (admin) |
| `Page` | Content | slug, title/title_en/title_ar, body/body_en/body_ar, content_en/content_ar, localized seo_*, is_published |
| `Faq` | Content | question/question_en/question_ar, answer/answer_en/answer_ar, group, sort_order, is_active |
| `Banner` | Content | title/title_en/title_ar, subtitle/subtitle_en/subtitle_ar, button_text_en/button_text_ar, image_path, link_url, placement, active window |
| `SupportMessage` | Support | name/email/phone/subject/message, status (new/read/archived), admin_note |
| `WishlistItem` | Wishlist | belongsTo User & Product (unique pair) |
| `AuditLog` | AuditLogs | actor (user_id), action, auditable morph, properties (json), ip_address |

Settings use the key-value `Setting` model (`app/Modules/Settings/Models`) read via
`Settings\Services\StoreSettings` (cached).

## Localization model behavior
`App\Support\Localization\LocalizedFields` resolves display fields from the request
locale (`en` or `ar-EG`) and falls back to English when Arabic content is empty.
`LocalizedStatusLabels` returns localized status objects with `label`, `label_en`
and `label_ar`. The public API uses these helpers; the admin dashboard translation
editing UI is deferred to the next part.

## Status enums (implemented, `HasLabel`)
- **OrderStatus:** Pending, AwaitingConfirmation, Confirmed, Preparing, ReadyToShip,
  Shipped, Delivered, Cancelled, Rejected, Refunded.
- **PaymentStatus:** Unpaid, AwaitingProof, ProofUploaded, UnderReview, Approved,
  Rejected, Paid, Refunded.
- **ShippingStatus:** NotStarted, Preparing, ReadyToShip, Shipped, OutForDelivery,
  Delivered, Failed, Returned.
- **CustomOrderStatus:** Pending, UnderReview, MoreDetailsNeeded, Quoted,
  CustomerAccepted, CustomerRejected, Approved, ConvertedToOrder, Rejected, Cancelled.

Each string-backed enum uses the shared `App\Support\Enums\HasLabels` trait and
implements Filament's `HasLabel` for admin selects/badges.
