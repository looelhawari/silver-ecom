import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const errors = useTranslations("errors");
  const common = useTranslations("common");

  return (
    <StorefrontShell>
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-serif text-6xl font-semibold text-[var(--accent)]">404</p>
        <h1 className="mt-4 font-serif text-2xl font-semibold">{errors("pageNotFound")}</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {common("pleaseTryAgain")}
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link href="/">{common("backHome")}</Link></Button>
          <Button asChild variant="secondary"><Link href="/shop">{common("shopSilver")}</Link></Button>
        </div>
      </div>
    </StorefrontShell>
  );
}
