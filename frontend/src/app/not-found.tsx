import Link from "next/link";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StorefrontShell>
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-serif text-6xl font-semibold text-[var(--accent)]">404</p>
        <h1 className="mt-4 font-serif text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link href="/">Back home</Link></Button>
          <Button asChild variant="secondary"><Link href="/shop">Shop silver</Link></Button>
        </div>
      </div>
    </StorefrontShell>
  );
}
