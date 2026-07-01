import { defaultLocale, localeDirections, locales, type Locale } from "@/i18n/routing";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isLocale(value ?? undefined) ? (value as Locale) : defaultLocale;
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeDirections[locale];
}

export function isRtl(locale: Locale): boolean {
  return getDirection(locale) === "rtl";
}

export function localizedField<T extends Record<string, unknown>>(
  item: T | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!item) return "";

  const english =
    item[`${field}_en`] ??
    item[field] ??
    item[field.replace(/_en$/, "")];
  const arabic = item[`${field}_ar`];
  const preferred = locale === "ar-EG" ? arabic : english;
  const fallback = locale === "ar-EG" ? english : arabic;

  return String(preferred || fallback || "");
}
