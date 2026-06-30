# Cart Module

**Responsibility:** Server-validated shopping cart for guests (session/token) and logged-in users. Never trusts client prices; recomputes line totals from Catalog.

**Owned tables (planned):** carts, cart_items

**Depends on:** Catalog

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
