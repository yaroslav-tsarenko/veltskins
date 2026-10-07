"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Check, CircleHelp, LockKeyhole, Plus, Square, SquareCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Plate } from "@/components/ui/Plate";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { PaymentLogos } from "@/components/shared/PaymentLogos/PaymentLogos";
import { LotAnnotations, skinFace, useAddToCart, type SkinProduct } from "@/components/skin/Lot";
import { LotNumber, WeaponLine } from "@/components/skin/WallLabel";
import { useWishlist } from "@/providers/WishlistProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useSteamAccount } from "@/components/account/SteamDelivery/SteamDelivery";
import { formatPrice } from "@/lib/utils/format-price";
import { STORE_POLICY } from "@/config/store-policy";
import { EXTERIORS, floatRangeLabel, weaponTypeDef } from "@/lib/skins/cs2";

export interface ExteriorOption {
  code: string;
  slug: string | null;
  price: number | null;
  current: boolean;
}

export interface MarkSwitch {
  current: "standard" | "stattrak";
  standard: string | null;
  stattrak: string | null;
}

export interface LotSheetProps {
  product: SkinProduct;
  breadcrumbs?: ReactNode;
  exteriors: ExteriorOption[];
  markSwitch: MarkSwitch | null;
  weaponHref: string | null;
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-h-11 grid-cols-[132px_minmax(0,1fr)] items-center gap-4 border-b border-line py-2">
      <dt className="label-caps text-ink-muted">{label}</dt>
      <dd className="m-0 text-ui-md text-ink">{children}</dd>
    </div>
  );
}

function ConditionSwitch({ options }: { options: ExteriorOption[] }) {
  const { currency, convert } = useCurrency();
  if (options.filter((o) => o.slug).length < 2) return null;
  return (
    <nav aria-label="This finish in other conditions" className="mt-7">
      <p className="eyebrow m-0 mb-2">Other conditions</p>
      <ul className="m-0 grid list-none grid-cols-5 border border-line p-0">
        {options.map((o, i) => {
          const def = EXTERIORS.find((e) => e.code === o.code);
          const body = (
            <>
              <span className="font-mono text-data font-medium">{o.code}</span>
              <span className="font-mono text-data-sm leading-none">{o.price !== null ? formatPrice(convert(o.price), currency, { compact: true }) : "—"}</span>
            </>
          );
          const base = cn("flex h-14 flex-col items-center justify-center gap-1 text-center", i > 0 && "border-l border-line");
          return (
            <li key={o.code} className="min-w-0">
              {o.current ? (
                <span aria-current="true" className={cn(base, "border-ink bg-ink text-surface")}>
                  {body}
                  <span className="sr-only">{def?.label}, this lot</span>
                </span>
              ) : o.slug ? (
                <Link
                  href={`/product/${o.slug}`}
                  className={cn(base, "text-ink-muted transition-colors duration-[120ms] hover-device:hover:bg-surface-1 hover-device:hover:text-ink")}
                  aria-label={`${def?.label}${o.price !== null ? `, ${formatPrice(convert(o.price), currency)}` : ""}`}
                >
                  {body}
                </Link>
              ) : (
                <span className={cn(base, "text-ink-faint")} aria-label={`${def?.label}, not in the catalogue`}>
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MarkToggle({ value }: { value: MarkSwitch }) {
  const item = (key: "standard" | "stattrak", label: ReactNode) => {
    const slug = value[key];
    const active = value.current === key;
    const cls = cn("flex h-10 flex-1 items-center justify-center px-3 text-ui-sm font-medium", key === "stattrak" && "border-l border-line");
    if (active)
      return (
        <span aria-current="true" className={cn(cls, "bg-brand-wash text-ink shadow-[inset_0_-2px_0_var(--color-accent)]")}>
          {label}
        </span>
      );
    if (!slug) return null;
    return (
      <Link href={`/product/${slug}`} className={cn(cls, "text-ink-muted hover-device:hover:bg-surface-1 hover-device:hover:text-ink")}>
        {label}
      </Link>
    );
  };
  return (
    <nav aria-label="StatTrak™ version" className="mt-3 flex rounded-control border border-control">
      {item("standard", "Standard")}
      {item("stattrak", "StatTrak™")}
    </nav>
  );
}

export function LotSheet({ product, breadcrumbs, exteriors, markSwitch, weaponHref }: LotSheetProps) {
  const router = useRouter();
  const { user } = useAuth();
  const steam = useSteamAccount(Boolean(user));
  const { isSaved, toggle, pending } = useWishlist();
  const { add, inCart, openSheet, price } = useAddToCart(product);
  const [barVisible, setBarVisible] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);
  const face = skinFace(product.name, product.skin);
  const skin = product.skin;
  const outOfStock = product.quantity !== undefined && product.quantity <= 0;
  const marked = isSaved(product.id);
  const range = skin ? floatRangeLabel(skin.floatMin, skin.floatMax) : null;
  const d = STORE_POLICY.delivery;
  const needsTradeUrl = Boolean(user) && Boolean(steam.steam) && !steam.steam?.tradeUrlVerified;

  useEffect(() => {
    const node = actionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--sticky-bar-offset", barVisible ? "64px" : "0px");
    return () => {
      document.documentElement.style.removeProperty("--sticky-bar-offset");
    };
  }, [barVisible]);

  const addFrom = (e: MouseEvent<HTMLElement>) => add(e.currentTarget.closest("[data-product]")?.querySelector("[data-scene=inspect]") ?? null);
  const buyNow = (e: MouseEvent<HTMLElement>) => {
    if (!inCart) add(e.currentTarget.closest("[data-product]")?.querySelector("[data-scene=inspect]") ?? null);
    router.push("/checkout");
  };

  return (
    <div data-rarity={face.rarity} className="flex flex-col">
      {breadcrumbs}
      <LotNumber sku={product.sku} className="mt-4" />
      <LotAnnotations face={face} className="mt-3" />
      <WeaponLine face={face} className="mt-3" />
      <h1 className="m-0 mt-2 font-display text-step-5 font-medium leading-[1.06] tracking-[-0.01em] text-ink [overflow-wrap:anywhere]" style={{ fontVariationSettings: '"opsz" 44' }}>
        {face.name}
      </h1>

      <dl className="m-0 mt-7 border-t border-line">
        <SpecRow label="Condition">
          {face.exteriorCode ? (
            <>
              {face.exteriorLabel}
              {range ? <span className="ml-2 font-mono text-data text-ink-muted">float {range}</span> : null}
            </>
          ) : (
            "Not painted"
          )}
        </SpecRow>
        {face.rarityLabel ? (
          <SpecRow label="Classification">
            <Plate variant="classification">{face.rarityLabel}</Plate>
          </SpecRow>
        ) : null}
        {skin ? <SpecRow label="Weapon">{skin.weapon}</SpecRow> : null}
        {skin ? <SpecRow label="Type">{weaponTypeDef(skin.weaponType)?.label ?? skin.weaponType}</SpecRow> : null}
        {skin?.phase ? <SpecRow label="Phase">{skin.phase}</SpecRow> : null}
        {skin?.collection ? <SpecRow label="Collection">{skin.collection}</SpecRow> : null}
        {skin?.isStatTrak ? <SpecRow label="StatTrak™">Counts kills made with this weapon</SpecRow> : null}
        {skin?.isSouvenir ? <SpecRow label="Souvenir">Dropped from a souvenir package at a CS2 Major</SpecRow> : null}
      </dl>

      <ConditionSwitch options={exteriors} />
      {markSwitch ? <MarkToggle value={markSwitch} /> : null}

      <div className="mt-8 flex items-end justify-between gap-4">
        {outOfStock ? (
          <span className="flex items-baseline gap-2 font-mono text-data text-ink-muted">
            Last price <PriceDisplay price={price} size="sm" />
          </span>
        ) : (
          <PriceDisplay price={price} size="sheet" face="display" />
        )}
        {!outOfStock && product.quantity !== undefined && product.quantity <= 3 ? (
          <span className="font-mono text-data-sm text-ink-muted">{product.quantity} available</span>
        ) : null}
      </div>

      <div ref={actionRef} data-action="" className="mt-5 flex flex-col gap-3">
        {outOfStock ? (
          <>
            <Button size="lg" isDisabled fullWidth>
              Out of stock
            </Button>
            <p className="m-0 text-ui-md text-ink-muted">
              This exact lot isn’t in the catalogue right now.{" "}
              {weaponHref ? (
                <Link href={weaponHref} className="font-medium text-ink underline decoration-1 underline-offset-4">
                  See other {skin?.weapon ?? ""} lots
                </Link>
              ) : null}
            </p>
          </>
        ) : !user ? (
          <>
            <Button size="lg" variant="steam" fullWidth as="a" href={`/api/auth/steam?next=${encodeURIComponent(`/product/${product.slug}`)}`}>
              Sign in through Steam to buy
            </Button>
            <Button size="lg" variant="outline" fullWidth onClick={addFrom} startContent={<Plus size={18} aria-hidden="true" />}>
              Add to cart
            </Button>
          </>
        ) : needsTradeUrl ? (
          <>
            <Button size="lg" fullWidth as={Link} href={`/account/steam?next=${encodeURIComponent(`/product/${product.slug}`)}`}>
              Add your trade URL
            </Button>
            <Button size="lg" variant="outline" fullWidth onClick={addFrom} startContent={<Plus size={18} aria-hidden="true" />}>
              Add to cart
            </Button>
          </>
        ) : inCart ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" variant="outline" onPress={openSheet} startContent={<Check size={18} aria-hidden="true" />}>
              In cart
            </Button>
            <Button size="lg" as={Link} href="/checkout">
              Checkout
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={addFrom} startContent={<Plus size={18} aria-hidden="true" />}>
              Add to cart
            </Button>
            <Button size="lg" variant="outline" onClick={buyNow}>
              Buy now
            </Button>
          </div>
        )}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          disabled={pending(product.id)}
          aria-pressed={marked}
          className="inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline disabled:cursor-wait"
        >
          {marked ? <SquareCheck size={18} aria-hidden="true" /> : <Square size={18} aria-hidden="true" />}
          {marked ? "Marked" : "Mark"}
        </button>
      </div>

      <ul className="m-0 mt-8 list-none border-t border-line p-0">
        <li className="flex items-start gap-3 border-b border-line py-3.5">
          <ArrowLeftRight size={18} aria-hidden="true" className="mt-0.5 text-ink" />
          <p className="m-0 text-ui-md text-ink">
            Delivered as a {d.method} to your trade URL, {d.usualTime}.
          </p>
        </li>
        <li className="flex items-center gap-3 border-b border-line py-3.5">
          <LockKeyhole size={18} aria-hidden="true" className="text-ink" />
          <p className="m-0 flex-1 text-ui-md text-ink">Card payment</p>
          <PaymentLogos height={20} withPci={false} />
        </li>
        <li className="flex items-center gap-3 border-b border-line py-3.5">
          <CircleHelp size={18} aria-hidden="true" className="text-ink" />
          <Link href="/how-it-works" className="text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline">
            How delivery works
          </Link>
        </li>
      </ul>

      {!outOfStock ? (
        <div
          data-sticky-buy=""
          aria-hidden={!barVisible}
          inert={!barVisible}
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-between gap-4 border-t border-line bg-mount px-gutter transition-transform duration-[220ms] ease-[var(--ease-hang)] lg:hidden",
            barVisible ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="min-w-0">
            <p className="m-0 truncate text-ui-sm text-ink-muted">{face.name}</p>
            <PriceDisplay price={price} size="sm" />
          </div>
          {inCart ? (
            <Button size="md" as={Link} href="/checkout">
              Checkout
            </Button>
          ) : (
            <Button size="md" onClick={addFrom}>
              Add to cart
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
