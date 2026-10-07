"use client";

import { formatPrice } from "@/lib/utils/format-price";
import { useCurrency } from "@/providers/CurrencyProvider";

function round(value: number): number {
  return value >= 100 ? Math.round(value / 10) * 10 : Math.round(value);
}

export function useBandFormatter() {
  const { currency, convert } = useCurrency();
  return (value: number) => formatPrice(round(convert(value)), currency, { compact: true });
}

export function BandAmount({ value }: { value: number }) {
  const format = useBandFormatter();
  return <>{format(value)}</>;
}

export function BandRange({ min, max }: { min: number | null; max: number | null }) {
  const format = useBandFormatter();
  if (min === null && max !== null) return <>Under {format(max)}</>;
  if (min !== null && max === null) return <>{format(min)} and above</>;
  if (min !== null && max !== null) return <>{`${format(min)}–${format(max)}`}</>;
  return <>All prices</>;
}

export function BandSentence({ min, max, count }: { min: number; max: number; count: number }) {
  const format = useBandFormatter();
  return (
    <>
      The {count} most recently catalogued lots between {format(min)} and {format(max)}.
    </>
  );
}
