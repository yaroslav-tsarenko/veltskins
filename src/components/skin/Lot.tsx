"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { Check, Plus, Square, SquareCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { Plate } from "@/components/ui/Plate";
import { Button } from "@/components/ui/Button";
import { SkeletonBar } from "@/components/ui/ReadoutLoader";
import { itemQuantityCap } from "@/lib/pricing";
import type { SkinSummary } from "@/lib/skins/cs2";
import { skinFace, type SkinFace, type SkinProduct } from "./face";

export { skinFace, type SkinFace, type SkinProduct };
import { LotRender, type RenderAspect } from "./LotRender";
import { StarMark } from "./StarMark";
import { ConditionStrip } from "./ConditionGrid";
import { Wire } from "./HangLine";
import { ClassificationLine, ConditionLine, LotNumber, WallLabel, WeaponLine } from "./WallLabel";

export { WeaponLine, LotNumber, ConditionLine, ClassificationLine };

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function LotAnnotations({ face, max = 2, className }: { face: SkinFace; max?: number; className?: string }) {
  const marks: ReactNode[] = [];
  if (face.stattrak) marks.push(<Plate key="st" variant="stattrak" aria-label="StatTrak">ST</Plate>);
  if (face.souvenir) marks.push(<Plate key="sv" variant="souvenir">Souvenir</Plate>);
  if (face.star) marks.push(<Plate key="star" variant="star"><StarMark size={10} />Star</Plate>);
  if (face.phase) marks.push(<Plate key="ph" variant="phase">{face.phase}</Plate>);
  if (marks.length === 0) return null;
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{marks.slice(0, max)}</div>;
}

export function useAddToCart(product: SkinProduct) {
  const { addItem, cart, openSheet } = useCart();
  const price = toNumber(product.price) ?? 0;
  const imageUrl = product.imageUrl ?? product.images?.[0]?.url ?? null;
  const inCart = cart.items.some((item) => item.productId === product.id);
  const add = (source?: Element | null) => {
    window.dispatchEvent(new CustomEvent("velt:cart-add", { detail: { productId: product.id, source: source ?? null } }));
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku ?? product.id,
      price,
      quantity: 1,
      imageUrl,
      maxQuantity: itemQuantityCap(product.quantity),
      skin: product.skin ?? undefined,
    });
  };
  return { add, inCart, openSheet, price, imageUrl };
}

export interface LotProps {
  product: SkinProduct;
  variant?: "standard" | "anchor";
  priority?: boolean;
  sizes?: string;
  headingLevel?: 2 | 3 | 4;
  wire?: number | null;
  className?: string;
  renderAspect?: RenderAspect;
  spot?: boolean;
  readout?: ReactNode;
}

export function Lot({
  product,
  variant = "standard",
  priority,
  sizes,
  headingLevel = 3,
  wire = null,
  className,
  renderAspect,
  spot = false,
  readout,
}: LotProps) {
  const { isSaved, toggle, pending } = useWishlist();
  const { add, inCart, openSheet, price, imageUrl } = useAddToCart(product);
  const [adding, setAdding] = useState(false);
  const face = skinFace(product.name, product.skin, product.category);
  const outOfStock = product.quantity !== undefined && product.quantity <= 0;
  const marked = isSaved(product.id);
  const anchor = variant === "anchor";
  const href = `/product/${product.slug}`;
  const alt = product.images?.[0]?.alt || product.name;
  const available = product.quantity !== undefined && product.quantity > 0 && product.quantity <= 3 ? product.quantity : null;
  const describe = [face.rarityLabel, face.exteriorLabel].filter(Boolean).join(", ");
  const descId = `lot-${product.id}-desc`;

  return (
    <article
      data-lot=""
      data-variant={variant}
      data-rarity={face.rarity}
      aria-describedby={describe ? descId : undefined}
      className={cn("relative flex min-w-0 flex-col", className)}
    >
      {describe ? (
        <span id={descId} className="sr-only">
          {describe}
        </span>
      ) : null}
      {wire !== null ? <Wire length={wire} offset="12%" /> : null}
      <div data-lot-body="" className="flex min-w-0 flex-col">
        <LotRender
          src={imageUrl}
          alt={alt}
          aspect={renderAspect ?? (anchor ? "16/11" : "5/4")}
          priority={priority}
          spot={spot}
          sizes={sizes ?? (anchor ? "(min-width: 1024px) 720px, 100vw" : undefined)}
          viewTransition={`render-${product.id}`}
          className={cn(outOfStock && "opacity-55")}
        >
          <div className="absolute left-0 top-0 z-[5] flex flex-wrap items-center gap-2 pr-12">
            {outOfStock ? <Plate variant="neutral">Out of stock</Plate> : null}
            {outOfStock ? null : <LotAnnotations face={face} className="contents" />}
          </div>
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={marked}
            aria-label={marked ? `Marked: ${product.name}` : `Mark ${product.name}`}
            disabled={pending(product.id)}
            className={cn(
              "absolute right-0 top-0 z-[5] flex size-11 cursor-pointer items-center justify-center rounded-control text-ink transition-opacity duration-[120ms] hover-device:size-9 hover-device:hover:bg-surface-1",
              marked ? "opacity-100" : "hover-device:opacity-0 hover-device:group-[]/lot:opacity-100 [[data-lot]:hover_&]:opacity-100 [[data-lot]:focus-within_&]:opacity-100",
            )}
          >
            {marked ? <SquareCheck size={18} aria-hidden="true" /> : <Square size={18} aria-hidden="true" />}
          </button>
        </LotRender>
        <WallLabel
          face={face}
          sku={product.sku}
          href={href}
          headingLevel={headingLevel}
          size={anchor ? "anchor" : "standard"}
          className="mt-3.5"
        />
      </div>
      {readout}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2.5">
        <div className="flex min-w-0 flex-col gap-1">
          {outOfStock ? (
            <span className="font-mono text-data text-ink-muted">
              Last price <PriceDisplay price={price} size="sm" className="text-ink-muted" />
            </span>
          ) : (
            <PriceDisplay price={price} size={anchor ? "md" : "sm"} />
          )}
          {available ? <span className="font-mono text-data-sm leading-none text-ink-muted">{available} available</span> : null}
        </div>
        {outOfStock ? null : inCart ? (
          <button
            type="button"
            onClick={openSheet}
            className="relative z-[3] inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 text-ui-sm font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline"
          >
            <Check size={16} aria-hidden="true" />
            In cart
          </button>
        ) : (
          <Button
            size={anchor ? "md" : "sm"}
            variant="outline"
            isLoading={adding}
            onClick={(event: MouseEvent<HTMLElement>) => {
              setAdding(true);
              add(event.currentTarget.closest("[data-lot]"));
              window.setTimeout(() => setAdding(false), 160);
            }}
            aria-label={`Add ${product.name} to cart`}
            startContent={<Plus size={16} aria-hidden="true" />}
            className="z-[3] shrink-0 [[data-lot]:focus-within_&]:border-brand [[data-lot]:focus-within_&]:bg-brand [[data-lot]:focus-within_&]:text-on-brand [[data-lot]:hover_&]:border-brand [[data-lot]:hover_&]:bg-brand [[data-lot]:hover_&]:text-on-brand"
          >
            Add
          </Button>
        )}
      </div>
    </article>
  );
}

export interface LotRowProps {
  name: string;
  href?: string | null;
  imageUrl?: string | null;
  sku?: string | null;
  skin?: SkinSummary | null;
  fallbackLine?: string | null;
  meta?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  size?: "sm" | "md";
  headingLevel?: 2 | 3 | 4;
  showRarity?: boolean;
  className?: string;
}

export function LotRow({
  name,
  href,
  imageUrl,
  sku,
  skin,
  fallbackLine,
  meta,
  aside,
  children,
  size = "sm",
  headingLevel = 3,
  showRarity = true,
  className,
}: LotRowProps) {
  const face = skinFace(name, skin, fallbackLine);
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const renderWidth = size === "md" ? "w-[120px] sm:w-[160px]" : "w-24";
  return (
    <div data-lot-row="" data-rarity={face.rarity} className={cn("relative flex min-w-0 gap-4", className)}>
      <div className={cn("shrink-0", renderWidth)}>
        <LotRender src={imageUrl} alt="" compact sizes={size === "md" ? "160px" : "96px"} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <LotNumber sku={sku} />
            <WeaponLine face={face} className="mt-1" />
            <Heading className={cn("m-0 mt-1 font-display font-medium leading-[1.2] tracking-normal text-ink", size === "md" ? "text-step-1" : "text-step-0")}>
              {href ? (
                <Link href={href} className="line-clamp-2 decoration-1 underline-offset-4 hover-device:hover:underline">
                  {face.name}
                </Link>
              ) : (
                <span className="line-clamp-2">{face.name}</span>
              )}
            </Heading>
          </div>
          {aside ? <div className="shrink-0 text-right">{aside}</div> : null}
        </div>
        {skin ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <ConditionStrip exterior={face.exteriorCode} />
            <span className="text-ui-sm text-ink-muted">{face.exteriorLabel}</span>
            {showRarity && face.rarityLabel ? <Plate variant="classification">{face.rarityLabel}</Plate> : null}
            <LotAnnotations face={face} />
          </div>
        ) : null}
        {meta}
        {children}
      </div>
    </div>
  );
}

export function LotSkeleton({ variant = "standard" }: { variant?: "standard" | "anchor" }) {
  return (
    <div aria-hidden="true" className="flex flex-col [--rarity:var(--color-border)]">
      <div className={cn("bg-surface-2", variant === "anchor" ? "aspect-[16/11]" : "aspect-[5/4]")} />
      <div className="wall-label mt-3.5 w-[84%] px-3.5 pb-3.5 pt-3">
        <SkeletonBar className="w-16" />
        <SkeletonBar className="mt-3 w-[70%]" />
        <SkeletonBar className="mt-3 w-14" />
      </div>
    </div>
  );
}

export function SalonGrid({ children, className, columns = 4 }: { children: ReactNode; className?: string; columns?: 2 | 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-2 gap-x-3 gap-y-8 lg:gap-x-6 lg:gap-y-11",
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SalonGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 2 | 3 | 4 }) {
  return (
    <SalonGrid columns={columns}>
      {Array.from({ length: count }).map((_, i) => (
        <LotSkeleton key={i} />
      ))}
    </SalonGrid>
  );
}
