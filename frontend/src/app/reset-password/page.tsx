import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ResetPasswordView } from "@/components/storefront/reset-password-view";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center">Loading…</div>}>
        <ResetPasswordView />
      </Suspense>
    </StorefrontShell>
  );
}
