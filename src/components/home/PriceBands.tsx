"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Lot } from "@/components/skin/Lot";
import { cn } from "@/lib/utils/cn";
import type { HomePriceBand } from "./types";
import { SectionHead } from "./SectionHead";
import { BandRange } from "./BandRange";

function bandHref(band: HomePriceBand): string {
  const query = new URLSearchParams();
  if (band.min !== null) query.set("minPrice", String(band.min));
  if (band.max !== null) query.set("maxPrice", String(band.max));
  query.set("sort", "price-asc");
  return `/catalog?${query.toString()}`;
}

export function PriceBands({ bands }: { bands: HomePriceBand[] }) {
  const [selected, setSelected] = useState(bands[0]?.key ?? null);
  if (bands.length === 0) return null;
  const active = bands.find((b) => b.key === selected) ?? bands[0];

  return (
    <section aria-labelledby="bands-title" className="bg-surface-1 pb-24 pt-18">
      <div className="mx-auto max-w-wide px-gutter">
        <SectionHead id="bands-title" title="By price" lead="Four bands across the catalogue. Pick one to see the cheapest lots in it." />
        <div className="mt-11 grid grid-cols-12 gap-x-7 gap-y-10">
          <div role="radiogroup" aria-label="Price band" className="col-span-12 lg:col-span-4">
            {bands.map((band, index) => {
              const on = band.key === active.key;
              return (
                <button
                  key={band.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSelected(band.key)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    e.preventDefault();
                    const next = bands[(index + (e.key === "ArrowDown" ? 1 : bands.length - 1)) % bands.length];
                    setSelected(next.key);
                  }}
                  className={cn(
                    "relative flex min-h-14 w-full cursor-pointer items-center gap-4 border-b border-line text-left text-step-1 text-ink transition-colors duration-[120ms] first:border-t",
                    on && "font-medium",
                  )}
                >
                  {on ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" /> : null}
                  <span className="min-w-0 flex-1">
                    <BandRange min={band.min} max={band.max} />
                  </span>
                  <span className="shrink-0 font-mono text-data text-ink-muted">{band.total.toLocaleString("en-GB")}</span>
                  <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-faint" />
                </button>
              );
            })}
            <Link href={bandHref(active)} className="mt-6 inline-flex min-h-10 items-center text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline">
              All lots <BandRange min={active.min} max={active.max} />
            </Link>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:col-span-8 lg:grid-cols-4">
            {active.products.map((p) => (
              <Lot key={p.id} product={p} sizes="(min-width: 1024px) 220px, 45vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
