# Data Models

Domain models and relationships. In Phase 1 only `User` exists; the rest are
designed here and implemented in their module phases. Models live in their owning
module under `app/Modules/<Module>/Models` (the framework `User` stays in
`app/Models`).

## Implemented (Phase 1)

### User — `app/Models/User.php`
- Traits: `HasApiTokens` (Sanctum), `HasRoles` (Spatie), `Notifiable`, `HasFactory`.
- Implements `FilamentUser`; `canAccessPanel()` allows only admin roles
  (`super-admin`, `staff`, `order-manager`, `content-manager`, `product-manager`).
- A "customer" is a `User` with no admin role.

## Planned models

| Model | Module | Relationships |
|-------|--------|---------------|
| Category | Catalog | hasMany Product |
| SilverType | Catalog | hasMany Product; holds `gram_price`, `purity`, `gram_price_updated_at` |
| Product | Catalog | belongsTo Category, SilverType; hasMany ProductImage, ProductVariant |
| ProductImage | Catalog | belongsTo Product (`is_main`, `sort_order`) |
| ProductVariant | Catalog | belongsTo Product (size/ring size/chain length/finish) |
| Cart / CartItem | Cart | Cart hasMany CartItem; CartItem belongsTo Product/Variant |
| Order | Orders | belongsTo User (nullable); hasMany OrderItem, OrderStatusHistory; hasOne ShippingAddress |
| OrderItem | Orders | belongsTo Order, Product (snapshotted price/name) |
| OrderStatusHistory | Orders | belongsTo Order; `status`, `changed_by`, `note`, `visible_to_customer` |
| PaymentMethod | Payments | hasMany PaymentProof; enable/disable, instructions, requires_proof |
| PaymentProof | Payments | belongsTo Order, PaymentMethod; uploaded file, review status |
| ShippingAddress | Shipping | belongsTo Order |
| CustomOrderRequest | CustomOrders | belongsTo User (nullable); hasMany CustomOrderImage; hasOne CustomOrderQuote; trackable code |
| CustomOrderImage | CustomOrders | belongsTo CustomOrderRequest |
| CustomOrderQuote | CustomOrders | belongsTo CustomOrderRequest; weight/gram price/workmanship/final quote |
| UserAddress | Users | belongsTo User |
| Page | Content | slug, title, body (EN/AR), SEO fields |
| Faq | Content | question/answer (EN/AR), group, sort |
| Banner | Content | image, link, placement, active window |
| SupportMessage | Support | name/phone/email/message, read/archived |
| Wishlist / WishlistItem | Wishlist | belongsTo User; WishlistItem belongsTo Product |
| AuditLog | AuditLogs | actor, action, subject (morph), changes, timestamp |

## Statuses (planned enums)

- **Order:** Pending, Awaiting Confirmation, Confirmed, Preparing, Ready to Ship,
  Shipped, Delivered, Cancelled, Rejected, Refunded.
- **Payment:** Unpaid, Awaiting Proof, Proof Uploaded, Under Review, Approved,
  Rejected, Paid, Refunded.
- **Shipping:** Not Started, Preparing, Ready to Ship, Shipped, Out for Delivery,
  Delivered, Failed, Returned.
- **Custom request:** Pending, Under Review, More Details Needed, Quoted, Customer
  Accepted, Customer Rejected, Approved, Converted to Order, Rejected, Cancelled.
