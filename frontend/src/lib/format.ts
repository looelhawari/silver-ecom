export function formatPrice(value: number, currency = "EGP"): string {
  const amount = new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  return `${amount} ${currency}`;
}
