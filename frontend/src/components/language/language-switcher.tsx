"use client";

import { Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextLocale = locales.find((item) => item !== locale) ?? "en";
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <button
      type="button"
      aria-label={t("switchTo")}
      onClick={() => router.replace(href, { locale: nextLocale })}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-white/80 px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
    >
      <Globe2 className="h-4 w-4" />
      <span>{localeLabels[nextLocale]}</span>
    </button>
  );
}
