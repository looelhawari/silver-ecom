"use client";

import { Heart, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export function HeaderAccountButton() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Button asChild className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label="Wishlist">
        <Link href="/wishlist">
          <Heart className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label={user ? "Account" : "Sign in"}>
        <Link href={user ? "/account" : "/login"}>
          <UserRound className="h-4 w-4" />
        </Link>
      </Button>
    </>
  );
}
