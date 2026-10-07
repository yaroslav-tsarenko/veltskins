"use client";

import { formatPrice } from "@/lib/utils/format-price";
import { useCurrency } from "@/providers/CurrencyProvider";
import { cn } from "@/lib/utils/cn";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  size?: "sm" | "md" | "lg" | "sheet";
  face?: "mono" | "display";
  className?: string;
}

const PRICE_SIZE = {
  sm: "text-[0.9375rem] leading-[1.1]",
  md: "text-step-1 leading-[1.1]",
  lg: "text-step-2 leading-[1.05]",
  sheet: "text-step-4 leading-none tracking-[-0.01em]",
};

export function PriceDisplay({ price, size = "md", face = "mono", className }: PriceDisplayProps) {
  const { currency, convert } = useCurrency();

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        data-price=""
        className={cn(face === "display" ? "font-display font-semibold text-ink" : "price text-ink", PRICE_SIZE[size])}
        style={face === "display" ? { fontVariationSettings: '"opsz" 40' } : undefined}
      >
        {formatPrice(convert(price), currency)}
      </span>
    </span>
  );
}

export function PriceChange({ from, to }: { from: number; to: number }) {
  const { currency, convert } = useCurrency();
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <s className="font-mono text-data text-ink-muted">
        <span className="sr-only">Previously </span>
        {formatPrice(convert(from), currency)}
      </s>
      <span className="price text-step-1 text-ink">
        <span className="sr-only">Now </span>
        {formatPrice(convert(to), currency)}
      </span>
    </span>
  );
}
