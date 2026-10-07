"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LotRender } from "@/components/skin/LotRender";
import { skinFace } from "@/components/skin/Lot";
import { formatPrice } from "@/lib/utils/format-price";
import { useCurrency } from "@/providers/CurrencyProvider";
import { cn } from "@/lib/utils/cn";
import type { HomeRarityTier } from "./types";

function MinPrice({ value }: { value: number | null }) {
  const { currency, convert } = useCurrency();
  if (value === null) return null;
  return <>from {formatPrice(convert(value), currency)}</>;
}

export function Register({ tiers }: { tiers: HomeRarityTier[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const active = tiers.find((t) => t.key === open);

  return (
    <section data-scene="register" aria-labelledby="register-title" className="bg-surface pb-24 pt-30">
      <div className="mx-auto max-w-wide px-gutter">
        <div className="grid grid-cols-12 gap-x-7 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <h2 id="register-title" className="m-0 font-display text-step-4 font-medium leading-[1.12] tracking-[-0.005em] text-ink">
              Classification
            </h2>
            <p className="m-0 mt-5 text-step-0 leading-[1.6] text-ink-muted">
              Classification is the drop tier Counter-Strike 2 assigns to a skin when it is released. It is not a measure of quality and it says nothing about the condition of a particular copy.
            </p>
            <p className="m-0 mt-4 text-step-0 leading-[1.6] text-ink-muted">
              Every lot prints its tier on the wall label, in the tier&rsquo;s own colour, next to the condition.
            </p>
          </div>

          <div className="col-span-12 min-w-0 lg:col-span-9">
            <ul className="relative m-0 list-none p-0">
              {tiers.map((tier) => {
                const empty = tier.count === 0;
                const isOpen = open === tier.key;
                const row = (
                  <>
                    <span aria-hidden="true" data-rarity={tier.slug} className={cn("absolute inset-x-0 top-0 bg-rarity transition-[height] duration-[120ms]", isOpen ? "h-1" : "h-0.5")} />
                    <span className="min-w-0 flex-1 truncate text-step-1">{tier.label}</span>
                    {empty ? (
                      <span className="shrink-0 text-ui-sm text-ink-faint">none in the catalogue</span>
                    ) : (
                      <>
                        <span className="shrink-0 font-mono text-data text-ink-muted">{tier.count.toLocaleString("en-GB")}</span>
                        <span className="hidden shrink-0 font-mono text-data text-ink-muted sm:inline">
                          <MinPrice value={tier.minPrice} />
                        </span>
                        <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-faint" />
                      </>
                    )}
                  </>
                );
                return (
                  <li key={tier.key} className="relative">
                    {empty ? (
                      <span className="relative flex min-h-14 items-center gap-5 pt-2.5 text-ink-faint">{row}</span>
                    ) : (
                      <Link
                        href={`/catalog?rarity=${tier.key}`}
                        onPointerEnter={() => setOpen(tier.key)}
                        onFocus={() => setOpen(tier.key)}
                        className={cn("relative flex min-h-14 items-center gap-5 pt-2.5 text-ink transition-colors duration-[120ms]", isOpen && "font-medium")}
                      >
                        {row}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            {active && active.strip.length > 0 ? (
              <div className="mt-10 border-t border-line pt-8">
                <p className="eyebrow m-0">{active.label} · around the middle of the tier</p>
                <div className="mt-5 grid grid-cols-3 gap-x-5">
                  {active.strip.map((p) => {
                    const face = skinFace(p.name, p.skin, p.category);
                    return (
                      <Link key={p.id} href={`/product/${p.slug}`} data-lot="" data-rarity={face.rarity} className="group min-w-0">
                        <LotRender src={p.imageUrl ?? p.images?.[0]?.url} alt="" sizes="(min-width: 1024px) 200px, 30vw" />
                        <p className="label-caps m-0 mt-3 text-ink-muted">{face.weaponLine}</p>
                        <p className="m-0 mt-1 line-clamp-2 font-display text-step-0 font-medium leading-[1.2] text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                          {face.name}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
