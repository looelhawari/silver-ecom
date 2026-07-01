import { Search, UserRound } from "lucide-react";
import Link from "next/link";

import { HeaderCartButton } from "@/components/layout/header-cart-button";
import { primaryNavigation, storeConfig } from "@/config";
import { Button } from "@/components/ui/button";

const monogram = storeConfig.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--foreground)] text-sm font-semibold tracking-wide text-[var(--background)]">
            {monogram}
          </span>
          <span className="truncate text-base font-semibold text-[var(--foreground)]">
            {storeConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryNavigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Search">
            <Link href="/shop">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="hidden sm:inline-flex"
            variant="ghost"
            size="icon"
            aria-label="Account"
          >
            <Link href="/track-order">
              <UserRound className="h-4 w-4" />
            </Link>
          </Button>
          <HeaderCartButton />
        </div>
      </div>
    </header>
  );
}
