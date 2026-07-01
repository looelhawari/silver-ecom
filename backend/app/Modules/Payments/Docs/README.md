# Payments Module

**Responsibility:** Manual payment methods (COD, Vodafone Cash, InstaPay, bank transfer), payment instructions, and payment-proof upload/review. Payment proof approval is the admin-controlled path that marks payment approved and can trigger the order confirmation email when the order is confirmed.

**Owned tables (planned):** payment_methods, payment_proofs

**Depends on:** Orders, Media, Settings

> Code folders (`Http`, `Models`, `Services`, `Actions`, `Policies`, `Routes`,
> `Http/Requests`, `Http/Resources`, `Tests`) are added in this module's
> implementation phase. See `/MODULES.md` for the full module map and boundary rules.
