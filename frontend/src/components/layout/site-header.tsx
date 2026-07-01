"use client";

import { Menu, MessageCircle, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/language/language-switcher";
import { HeaderAccountButton } from "@/components/layout/header-account-button";
import { HeaderCartButton } from "@/components/layout/header-cart-button";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { primaryNavigation, storeConfig } from "@/config";

const monogram = storeConfig.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

const whatsappHref = `https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

export function SiteHeader() {
  const t = useTranslations("navigation");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-all ${
        scrolled
          ? "border-[var(--border)] bg-[var(--background)]/95 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.3)]"
          : "border-transparent bg-[var(--background)]/70"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            aria-label={t("openMenu")}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--foreground)] text-sm font-semibold tracking-normal text-[var(--background)]">
              {monogram}
            </span>
            <span className="truncate font-serif text-lg font-semibold text-[var(--foreground)]">
              {storeConfig.name}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryNavigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{t(item.key ?? item.label)}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button asChild variant="ghost" size="icon" aria-label={t("shop")}>
            <Link href="/shop">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <HeaderAccountButton />
          <HeaderCartButton />
          <Button asChild size="sm" className="ml-1 hidden lg:inline-flex">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> {t("contact")}
            </a>
          </Button>
        </div>
      </div>

      {/* Mobile slide-over menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-[var(--background)] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-semibold">{storeConfig.name}</span>
              <button aria-label={t("closeMenu")} onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--surface)]"
                >
                  {t(item.key ?? item.label)}
                </Link>
              ))}
            </nav>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
            <Button asChild className="mt-6 w-full">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> {t("contact")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
