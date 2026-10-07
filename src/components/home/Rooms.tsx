"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LotRender } from "@/components/skin/LotRender";
import { skinFace } from "@/components/skin/Lot";
import { HangLine, Wire } from "@/components/skin/HangLine";
import { formatPrice } from "@/lib/utils/format-price";
import { useCurrency } from "@/providers/CurrencyProvider";
import { cn } from "@/lib/utils/cn";
import type { HomeWeaponType } from "./types";
import { SectionHead } from "./SectionHead";

function MinPrice({ value }: { value: number | null }) {
  const { currency, convert } = useCurrency();
  if (value === null) return null;
  return <>from {formatPrice(convert(value), currency)}</>;
}

export function Rooms({ types }: { types: HomeWeaponType[] }) {
  const knives = types.find((t) => t.key === "knives") ?? types[0];
  const rest = types.filter((t) => t.key !== knives?.key);
  const [hovered, setHovered] = useState<string | null>(null);
  const panelType = (hovered ? types.find((t) => t.key === hovered) : null) ?? knives;
  if (!knives) return null;
  const render = panelType?.render ?? null;
  const face = render ? skinFace(render.name, render.skin, render.category) : null;

  return (
    <section data-scene="rooms" aria-labelledby="rooms-title" className="bg-surface-1 pb-18 pt-24">
      <div className="mx-auto max-w-wide px-gutter">
        <SectionHead
          id="rooms-title"
          eyebrow="Rooms"
          title="One room for each kind"
          lead="The catalogue is split by weapon type. Every room shows its real number of lots and the cheapest one in it."
        />
        <div className="relative mt-14">
          <HangLine hooks={3} className="absolute inset-x-0 top-0" />
          <div className="grid grid-cols-12 gap-x-7 gap-y-12 pt-11">
            <div className="col-span-12 lg:col-span-5">
              <Link
                href={`/catalog/${panelType?.key ?? knives.key}`}
                className="group block"
                aria-label={`${panelType?.name ?? knives.name} lots`}
              >
                <div data-lot="" data-rarity={face?.rarity}>
                  <Wire length={28} offset="12%" />
                  {render ? (
                    <LotRender
                      src={render.imageUrl ?? render.images?.[0]?.url}
                      alt=""
                      aspect="3/4"
                      sizes="(min-width: 1024px) 440px, 100vw"
                      className="transition-opacity duration-[220ms]"
                    />
                  ) : (
                    <div className="aspect-[3/4] border border-line" />
                  )}
                </div>
                <h3 className="m-0 mt-6 font-display text-step-3 font-medium leading-[1.14] text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {panelType?.name ?? knives.name}
                </h3>
                <p className="m-0 mt-2 flex flex-wrap items-baseline gap-x-4 font-mono text-data text-ink-muted">
                  <span>{(panelType?.count ?? knives.count).toLocaleString("en-GB")} lots</span>
                  <MinPrice value={panelType?.minPrice ?? knives.minPrice} />
                </p>
              </Link>
            </div>

            <ul className="col-span-12 m-0 list-none p-0 lg:col-span-7">
              {[knives, ...rest].map((type) => (
                <li key={type.key} className="border-b border-line first:border-t">
                  <Link
                    href={`/catalog/${type.key}`}
                    data-room-row=""
                    onPointerEnter={() => setHovered(type.key)}
                    onFocus={() => setHovered(type.key)}
                    className={cn(
                      "flex min-h-14 items-center gap-5 py-2 text-ink transition-colors duration-[120ms]",
                      type.key === panelType?.key && "font-medium",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate text-step-1">{type.name}</span>
                    <span className="shrink-0 font-mono text-data text-ink-muted">{type.count.toLocaleString("en-GB")}</span>
                    <span className="hidden shrink-0 font-mono text-data text-ink-muted sm:inline">
                      <MinPrice value={type.minPrice} />
                    </span>
                    <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
