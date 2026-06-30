# Backend Modules

This directory holds the modular-monolith business boundaries. One Laravel app,
one database, internally divided into modules with clear ownership.

The authoritative module map and registration order live in
[`app/Support/Modules/ModuleRegistry.php`](../Support/Modules/ModuleRegistry.php).
A high-level overview is in [`/MODULES.md`](../../../MODULES.md).

## Module set (Phase 1)

Core, Access Control, Auth, Users, Catalog, Cart, Checkout, Orders, Payments,
Shipping, Custom Orders, Wishlist (optional), Content, Support, Media, Audit Logs,
Settings.

## What a module may own

- `Actions` — single-purpose use cases.
- `Http/Controllers`, `Http/Requests`, `Http/Resources` — API boundary.
- `Models` — module-owned persistence models.
- `Policies` — authorization decisions.
- `Routes/api.php` — auto-loaded under `/api/v1/{prefix}` when the module declares a prefix.
- `Services` — reusable orchestration.
- `Tests` — module feature/unit tests.
- `Docs/README.md` — the module charter (created in Phase 1).

## Conventions

- Each module folder ships a `Docs/README.md` charter from Phase 1. The remaining
  code folders are created **just-in-time** in the module's implementation phase —
  we do not pre-create empty scaffolding.
- Modules communicate through **actions, services, events, or explicit contracts**.
  Never reach into another module's models or internals from a controller.
- Cross-cutting concerns (file storage, audit logging) are provided as services by
  the `Media` and `AuditLogs` modules and consumed via their public service classes.
