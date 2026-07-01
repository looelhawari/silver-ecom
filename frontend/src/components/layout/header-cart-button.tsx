"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/useCartStore";

export function HeaderCartButton() {
  const t = useTranslations("navigation");
  // Avoid hydration mismatch: only show the persisted count after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <Button asChild variant="default" size="icon" aria-label={t("cart")} className="relative">
      <Link href="/cart">
        <ShoppingBag className="h-4 w-4" />
        {mounted && count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
