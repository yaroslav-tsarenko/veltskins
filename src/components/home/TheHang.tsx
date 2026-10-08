"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LotRender } from "@/components/skin/LotRender";
import { WallLabel } from "@/components/skin/WallLabel";
import { LotAnnotations, skinFace, type SkinProduct } from "@/components/skin/Lot";
import { Wire } from "@/components/skin/HangLine";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/utils/cn";

// Every satellite starts at the second rail and is dropped by the length of its own wire,
// never by a margin — a wire that starts in mid-air is what made the row read as floating
// debris rather than as a hang. No two lengths are equal, so no two tops align.
const WIRES = [18, 72, 40, 96];

function HeroSearch({ liveCount }: { liveCount: number }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="mt-9 flex max-w-[30rem] gap-2"
    >
      <label htmlFor="hang-search" className="sr-only">
        Search the catalogue
      </label>
      <div className="relative flex min-w-0 flex-1">
        <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id="hang-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Search ${liveCount.toLocaleString("en-GB")} lots`}
          className="h-14 w-full min-w-0 rounded-control border border-control bg-mount pl-12 pr-4 text-step-0 text-ink placeholder:text-ink-faint hover-device:hover:border-ink-muted"
        />
      </div>
      <Button type="submit" size="lg" className="shrink-0">
        Search
      </Button>
    </form>
  );
}

function AnchorLot({ product }: { product: SkinProduct }) {
  const face = skinFace(product.name, product.skin, product.category);
  return (
    <article data-lot="" data-variant="anchor" data-rarity={face.rarity} className="relative flex min-w-0 flex-col">
      <Wire length={24} offset="14%" className="hidden lg:block" />
      <div data-lot-body="" className="flex min-w-0 flex-col">
        <LotRender
          src={product.imageUrl ?? product.images?.[0]?.url}
          alt={product.images?.[0]?.alt || product.name}
          aspect="16/11"
          spot
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
        >
          <div className="absolute left-0 top-0 z-[5] flex flex-wrap items-center gap-2">
            <LotAnnotations face={face} className="contents" />
          </div>
        </LotRender>
        <WallLabel face={face} sku={product.sku} href={`/product/${product.slug}`} headingLevel={2} size="anchor" reserveLines={false} className="mt-3.5" />
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <PriceDisplay price={Number(product.price)} size="md" />
        <Link
          href={`/product/${product.slug}`}
          className="relative z-[3] text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline"
        >
          View the lot
        </Link>
      </div>
    </article>
  );
}

/**
 * A satellite in the hang. Same plate and wire as a full lot, but the label stops at the
 * price — the anchor is the only lot on this wall that carries a full label and an action,
 * which is what keeps the three sizes reading as a hierarchy rather than as five cards.
 */
function SatelliteLot({ product, wire, className }: { product: SkinProduct; wire: number; className?: string }) {
  const face = skinFace(product.name, product.skin, product.category);
  return (
    <article data-lot="" data-variant="satellite" data-rarity={face.rarity} className={cn("relative flex min-w-0 flex-col", className)}>
      {/* Only the desktop hang has a rail above this row; stacked on mobile the lots are a
          plain 2×2 block, and a wire with no rail to hang from just reads as a stray line. */}
      <Wire length={wire} offset="12%" className="hidden lg:block" />
      <LotRender
        src={product.imageUrl ?? product.images?.[0]?.url}
        alt={product.images?.[0]?.alt || product.name}
        aspect="5/4"
        sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, 45vw"
      >
        <div className="absolute left-0 top-0 z-[5] flex flex-wrap items-center gap-2">
          <LotAnnotations face={face} className="contents" />
        </div>
      </LotRender>
      <WallLabel face={face} sku={product.sku} href={`/product/${product.slug}`} size="standard" reserveLines={false} className="mt-3">
        <PriceDisplay price={Number(product.price)} size="sm" className="mt-2.5 block" />
      </WallLabel>
    </article>
  );
}

export function TheHang({ liveCount, anchor, hang }: { liveCount: number; anchor: SkinProduct | null; hang: SkinProduct[] }) {
  const satellites = hang.slice(0, 4);
  return (
    <section data-scene="hang" aria-labelledby="hang-title" className="relative bg-surface lg:min-h-[calc(100svh-var(--header-height))]">
      <div className="relative mx-auto max-w-wide px-gutter pb-18 lg:pb-24">
        <div aria-hidden="true" className="hang-rail absolute inset-x-0 top-12 lg:top-[72px]" data-rail="" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[84%] -z-10 hidden h-px bg-line lg:block" />
        <div className="pt-12 lg:grid lg:grid-cols-12 lg:gap-x-7 lg:pt-[72px]">
          <div className="lg:col-span-5 lg:pt-24">
            <p className="eyebrow m-0">CS2 catalogue</p>
            <h1
              id="hang-title"
              data-anim="words"
              className="m-0 mt-5 font-display font-semibold leading-[0.94] tracking-[-0.02em] text-ink text-step-6 lg:text-display-xl"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              <SplitWords text="Every skin hung, labelled and priced." />
            </h1>
            <p className="m-0 mt-7 max-w-[46ch] font-display text-step-1 leading-[1.56] text-ink-muted">
              Counter-Strike 2 skins, catalogued one lot at a time, with the condition, the classification and the price printed on every label. Pay by card and we send the skin to your Steam
              account as a trade offer.
            </p>
            <HeroSearch liveCount={liveCount} />
            <p className="m-0 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-ui-md">
              {["knives", "rifles", "pistols"].map((slug) => (
                <Link
                  key={slug}
                  href={`/catalog/${slug}`}
                  className="font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline"
                >
                  {slug === "knives" ? "Knives" : slug === "rifles" ? "Rifles" : "Pistols"}
                </Link>
              ))}
            </p>
          </div>

          {anchor ? (
            <div className="mt-14 lg:col-span-7 lg:mt-0">
              <AnchorLot product={anchor} />
            </div>
          ) : null}
        </div>

        {/* The satellites step across the whole room rather than crowding the anchor's
            columns, so the wall carries weight under the headline instead of leaving a
            hole there. They hang off a second rail at their own wire lengths. */}
        {satellites.length > 0 ? (
          <div className="relative mt-12 lg:mt-20">
            <div aria-hidden="true" className="hang-rail absolute inset-x-0 top-0 hidden lg:block" data-rail="" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-6">
              {satellites.map((p, i) => (
                <div key={p.id} className="min-w-0 lg:col-span-3">
                  <SatelliteLot product={p} wire={WIRES[i]} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
