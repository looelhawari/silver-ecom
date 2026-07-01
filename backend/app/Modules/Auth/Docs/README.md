# Auth Module

**Responsibility:** Authentication via Laravel Sanctum: register, login, first-login OTP, logout, current user, password reset. Issues SPA/token auth and applies login/register/reset/OTP rate limits.

**Owned tables (planned):** personal_access_tokens (Sanctum)

**Depends on:** Users, AccessControl

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
