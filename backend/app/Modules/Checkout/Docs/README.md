# Checkout Module

**Responsibility:** Checkout validation and order placement orchestration. Computes order totals server-side inside a DB transaction; coordinates Cart, Orders, Payments, Shipping. Owns no tables.

**Owned tables (planned):** (none — orchestrator)

**Depends on:** Cart, Catalog, Orders, Payments, Shipping

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
