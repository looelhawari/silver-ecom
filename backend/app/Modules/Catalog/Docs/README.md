# Catalog Module

**Responsibility:** Products, categories, silver types, variants, and product images. Owns the server-side pricing engine (fixed vs calculated: gram_price*weight + workmanship + markup - discount, with manual override).

**Owned tables (planned):** products, product_images, product_variants, categories, silver_types

**Depends on:** Media, AuditLogs

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
