"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LotRender } from "@/components/skin/LotRender";
import { WallLabel } from "@/components/skin/WallLabel";
import { Lot, LotAnnotations, skinFace, type SkinProduct } from "@/components/skin/Lot";
import { Wire } from "@/components/skin/HangLine";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/utils/cn";

const WIRES = [18, 48, 56, 64];
const SMALL_PLACE = [
  "lg:col-start-7 lg:col-end-13 lg:row-start-1",
  "lg:col-start-8 lg:col-end-13 lg:row-start-2 lg:mt-6",
  "lg:col-start-1 lg:col-end-5 lg:row-start-3",
  "lg:col-start-5 lg:col-end-10 lg:row-start-3 lg:mt-10",
];

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
      <Wire length={24} offset="14%" />
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

export function TheHang({ liveCount, anchor, hang }: { liveCount: number; anchor: SkinProduct | null; hang: SkinProduct[] }) {
  const small = hang.slice(0, 4);
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
              <div className="lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:gap-x-5 lg:gap-y-8">
                <div className="lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-3">
                  <AnchorLot product={anchor} />
                </div>
                <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 lg:mt-0 lg:contents">
                  {small.map((p, i) => (
                    <div key={p.id} className={cn("min-w-0", SMALL_PLACE[i])}>
                      <Lot product={p} wire={WIRES[i]} sizes="(min-width: 1024px) 300px, 50vw" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
