# Orders Module

**Responsibility:** Orders, order items, status history, printable invoices, and order email triggers. Generates unique order codes; enforces clean order/payment/shipping status transitions.

**Owned tables (planned):** orders, order_items, order_status_history

**Depends on:** Catalog, AuditLogs

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
