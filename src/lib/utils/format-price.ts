export function formatPrice(
  amount: number | string,
  currency: string = "USD",
  options: { locale?: string; compact?: boolean } = {},
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const whole = Number.isInteger(numericAmount);
  return new Intl.NumberFormat(options.locale ?? "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: options.compact && whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
