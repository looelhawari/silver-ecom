import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar-EG"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export type Locale = (typeof locales)[number];

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  "ar-EG": "rtl",
};

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "ar-EG": "عربي",
};
