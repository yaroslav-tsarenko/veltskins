"use client";

import Link from "next/link";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import { HangLine } from "@/components/skin/HangLine";

export interface IndexLink {
  slug: string;
  label: string;
  count: number;
  href: string;
  active?: boolean;
}

export interface RarityBar {
  key: string;
  slug: string | undefined;
  label: string;
  count: number;
  href: string;
}

export interface CategoryOpenerProps {
  name: string;
  count: number;
  lead?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  index?: IndexLink[];
  indexLabel?: string;
  rarities?: RarityBar[];
  typeIndex?: IndexLink[];
}

export function PriceSpan({ min, max }: { min: number; max: number }) {
  const { currency, convert } = useCurrency();
  const money = (n: number) => formatPrice(convert(n), currency);
  return (
    <>
      from <span className="font-mono text-data text-ink">{money(min)}</span> to <span className="font-mono text-data text-ink">{money(max)}</span>
    </>
  );
}

export function CategoryOpener({ name, count, lead, minPrice, maxPrice, index = [], indexLabel = "Weapons", rarities = [], typeIndex = [] }: CategoryOpenerProps) {
  const maxRarity = Math.max(1, ...rarities.map((r) => r.count));
  return (
    <header data-category-opener="" className="pb-10 pt-1 lg:pb-12">
      <HangLine hooks={3} className="mb-11" />
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
        <div className={cn("min-w-0", typeIndex.length || rarities.length ? "lg:col-span-7" : "lg:col-span-12")}>
          <h1 className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-step-5 font-medium leading-[1.06] tracking-[-0.01em] text-ink">
            {name}
            <span className="font-mono text-data font-normal tracking-normal text-ink-muted">{count.toLocaleString("en-GB")}</span>
          </h1>
          {lead ? <p className="measure m-0 mt-4 text-step-1 leading-[1.5] text-ink-muted">{lead}</p> : null}
          {minPrice != null && maxPrice != null && count > 0 ? (
            <p className="m-0 mt-3 text-ui-md text-ink-muted">
              {count.toLocaleString("en-GB")} {count === 1 ? "lot" : "lots"} in the catalogue, <PriceSpan min={minPrice} max={maxPrice} />.
            </p>
          ) : null}
        </div>
        {typeIndex.length ? (
          <nav aria-label="Weapon types" className="lg:col-span-5">
            <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-1 p-0 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
              {typeIndex.map((l) => (
                <li key={l.slug}>
                  <Link href={l.href} className="nav-rule relative inline-flex min-h-9 items-baseline gap-2 font-sans text-ui-md font-semibold uppercase tracking-[0.06em] text-ink hover-device:hover:[&::after]:scale-x-100">
                    {l.label}
                    <span className="font-mono text-data-sm font-normal normal-case tracking-normal text-ink-faint">{l.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {rarities.length ? (
          <nav aria-label="Rarity in stock" className="lg:col-span-5">
            <p className="eyebrow m-0 mb-3">Rarity in stock</p>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {rarities.map((r) => (
                <li key={r.key} data-rarity={r.slug}>
                  <Link href={r.href} className="group grid grid-cols-[148px_minmax(0,1fr)_40px] items-center gap-3 py-0.5">
                    <span className="label-caps truncate text-rarity group-hover:underline">{r.label}</span>
                    <span aria-hidden="true" className="h-0.5 bg-rarity" style={{ width: `${Math.max(2, (r.count / maxRarity) * 100)}%` }} />
                    <span className="text-right font-mono text-data-sm text-ink-muted">{r.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      {index.length ? (
        <nav aria-label={indexLabel} className="mt-8 border-t border-line pt-4">
          <ul className="no-scrollbar -mx-gutter m-0 flex list-none gap-x-6 gap-y-2 overflow-x-auto px-gutter py-0 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {index.map((l) => (
              <li key={l.slug} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={l.active ? "page" : undefined}
                  className="inline-flex min-h-10 items-baseline gap-1.5 text-ui-md font-medium text-ink-muted decoration-1 underline-offset-4 hover-device:hover:text-ink hover-device:hover:underline aria-[current]:text-ink aria-[current]:underline aria-[current]:decoration-accent-ink aria-[current]:decoration-2"
                >
                  {l.label}
                  <span className="font-mono text-data-sm font-normal text-ink-faint">{l.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
