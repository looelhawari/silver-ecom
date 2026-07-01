"use client";

import { Heart, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function HeaderAccountButton() {
  const t = useTranslations("navigation");
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Button asChild className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label={t("wishlist")}>
        <Link href="/wishlist">
          <Heart className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label={user ? t("account") : t("signIn")}>
        <Link href={user ? "/account" : "/login"}>
          <UserRound className="h-4 w-4" />
        </Link>
      </Button>
    </>
  );
}
