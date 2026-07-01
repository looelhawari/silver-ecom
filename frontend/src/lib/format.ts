export function formatPrice(value: number, currency = "EGP", locale = "en"): string {
  const isArabic = locale === "ar-EG";
  const amount = new Intl.NumberFormat(isArabic ? "ar-EG" : "en-EG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  const label = isArabic && currency === "EGP" ? "ج.م" : currency;

  return `${amount} ${label}`;
}
