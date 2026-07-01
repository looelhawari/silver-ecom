import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type StorefrontShellProps = {
  children: ReactNode;
};

export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="bg-[var(--foreground)] px-4 py-2 text-center text-xs tracking-wide text-[var(--background)]">
        Free shipping over 3,000 EGP · Custom silver made to order · Secure checkout
      </div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
