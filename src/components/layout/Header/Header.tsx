"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ClipboardList, Menu, Search, User } from "lucide-react";
import { BrandLockup, Monogram } from "@/components/layout/BrandMark";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useSteamAccount } from "@/components/account/SteamDelivery/SteamDelivery";
import { catalogSlugFromPath, findRootSlug, useCategoryTree } from "@/lib/hooks/useCategoryTree";
import { FASCIA_LINKS, navCategory } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelect } from "./CurrencySelect";
import { CatalogueIndex } from "./CatalogueIndex";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "@/components/search/SearchDialog/SearchDialog";
import { CartSheet } from "@/components/cart/CartSheet/CartSheet";
import { CheckoutHeader } from "@/components/checkout/CheckoutFrame";

const navLink = cn(
  "nav-rule relative inline-flex h-full items-center whitespace-nowrap font-sans text-ui-md font-semibold uppercase tracking-[0.06em] text-ink-muted transition-colors duration-[120ms]",
  "hover-device:hover:text-ink aria-[current]:text-ink data-[active=true]:text-ink",
);

const action =
  "relative inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-control px-2 text-ui-sm font-semibold uppercase tracking-[0.06em] text-ink transition-colors duration-[120ms] hover-device:hover:bg-surface-1";

const NAV_VISIBILITY: Record<string, string> = {
  knives: "hidden min-[1152px]:inline-flex",
  gloves: "hidden 2xl:inline-flex",
  rifles: "hidden min-[1152px]:inline-flex",
  pistols: "hidden xl:inline-flex",
  "sniper-rifles": "hidden 2xl:inline-flex",
};

export function CartCount({ count, bump }: { count: number; bump: number }) {
  if (count <= 0) return null;
  return (
    <span
      data-cart-count=""
      className="inline-flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-none bg-brand px-1 font-mono text-data-sm font-semibold leading-none text-on-brand"
    >
      <span key={bump} className={cn("inline-block", bump > 0 && "animate-count-roll")}>
        {count > 99 ? "99+" : count}
      </span>
    </span>
  );
}

function CatalogFilterProbe({ onChange }: { onChange: (slug: string | null) => void }) {
  const params = useSearchParams();
  const types = (params.get("type") ?? "").split(",").filter(Boolean);
  const weapons = (params.get("weapon") ?? "").split(",").filter(Boolean);
  const slug = types.length === 1 ? types[0] : types.length === 0 && weapons.length === 1 ? weapons[0] : null;
  useEffect(() => onChange(slug), [slug, onChange]);
  return null;
}

function StoreHeader() {
  const pathname = usePathname();
  const [filterSlug, setFilterSlug] = useState<string | null>(null);
  const { itemCount, cartBounce, openSheet, isSheetOpen } = useCart();
  const { user } = useAuth();
  const steam = useSteamAccount(Boolean(user));
  const categories = useCategoryTree();
  const indexId = useId();
  const [indexOpen, setIndexOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const indexTimer = useRef<number | undefined>(undefined);
  const indexTrigger = useRef<HTMLButtonElement>(null);
  const anyOpen = indexOpen || mobileOpen || searchOpen || isSheetOpen;

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIndexOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || anyOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      e.preventDefault();
      setSearchOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [anyOpen]);

  const openIndex = useCallback((delay: number) => {
    window.clearTimeout(indexTimer.current);
    indexTimer.current = window.setTimeout(() => setIndexOpen(true), delay);
  }, []);

  const closeIndex = useCallback((delay: number, restoreFocus = false) => {
    window.clearTimeout(indexTimer.current);
    indexTimer.current = window.setTimeout(() => {
      setIndexOpen(false);
      if (restoreFocus) indexTrigger.current?.focus();
    }, delay);
  }, []);

  useEffect(() => {
    if (!indexOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIndex(0, true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [indexOpen, closeIndex]);

  const catalogSlug = catalogSlugFromPath(pathname);
  const filteredSlug = pathname === "/catalog" ? filterSlug : null;
  const activeRoot = findRootSlug(categories, catalogSlug ?? filteredSlug) ?? catalogSlug ?? filteredSlug;
  const indexActive = (pathname === "/catalog" && !filteredSlug) || (activeRoot !== null && !FASCIA_LINKS.includes(activeRoot));
  const persona = steam.steam?.personaName ?? user?.firstName ?? user?.name ?? null;
  const avatar = steam.steam?.avatar ?? null;

  return (
    <>
      <Suspense fallback={null}>
        <CatalogFilterProbe onChange={setFilterSlug} />
      </Suspense>
      <div aria-hidden="true" className="h-[var(--header-height-mobile)] shrink-0 lg:h-[var(--header-height)]" />
      <header
        data-header=""
        data-header-state={compact ? "compact" : "top"}
        data-print-hide=""
        onPointerLeave={() => {
          if (indexOpen) closeIndex(250);
        }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <div
          data-fascia=""
          className={cn(
            "relative bg-fascia text-ink transition-[height] duration-[220ms] ease-[var(--ease-std)]",
            "h-[var(--header-height-mobile)]",
            compact ? "lg:h-[var(--header-height-compact)]" : "lg:h-[var(--header-height)]",
          )}
        >
          <div className="mx-auto flex h-full max-w-container items-center justify-between gap-8 px-gutter">
            <Link href="/" aria-label={`${BRAND.name}, home`} className="flex shrink-0 items-center text-ink">
              <span className="max-[360px]:hidden">
                <BrandLockup size={16} className="lg:hidden" />
              </span>
              <span className="min-[361px]:hidden">
                <Monogram size={28} />
              </span>
              <span className="hidden lg:inline-flex">
                <BrandLockup size={20} />
              </span>
            </Link>

            <nav aria-label="Main" className="hidden h-full min-w-0 flex-1 items-center justify-center gap-6 lg:flex">
              {FASCIA_LINKS.map((slug) => {
                const cat = navCategory(slug);
                const current = catalogSlug === slug ? "page" : activeRoot === slug ? "true" : undefined;
                const label = slug === "sniper-rifles" ? "Snipers" : cat?.short ?? slug;
                return (
                  <Link key={slug} href={`/catalog/${slug}`} aria-current={current} className={cn(navLink, NAV_VISIBILITY[slug])}>
                    {label}
                  </Link>
                );
              })}
              <button
                ref={indexTrigger}
                type="button"
                data-index-trigger=""
                data-active={indexActive || undefined}
                aria-expanded={indexOpen}
                aria-controls={indexId}
                onClick={() => {
                  window.clearTimeout(indexTimer.current);
                  setIndexOpen((v) => !v);
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") openIndex(150);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse" && !indexOpen) window.clearTimeout(indexTimer.current);
                }}
                className={cn(navLink, "cursor-pointer gap-1", indexOpen && "text-ink")}
              >
                Catalogue
                <ChevronDown size={16} aria-hidden="true" className={cn("transition-transform duration-[120ms]", indexOpen && "rotate-180")} />
              </button>
            </nav>

            <div className="flex shrink-0 items-center gap-1 lg:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "hidden h-9 w-40 cursor-pointer items-center gap-2 rounded-control border border-control bg-surface-2 px-3 text-left text-ui-sm text-ink-faint",
                  "transition-colors duration-[120ms] hover-device:hover:border-ink-muted lg:flex min-[1152px]:w-[180px] xl:w-[220px]",
                )}
              >
                <Search size={16} aria-hidden="true" className="text-ink-muted" />
                <span className="flex-1 truncate">Search the catalogue</span>
                <kbd className="border border-line px-1.5 font-mono text-data-sm leading-[1.3] text-ink-muted">/</kbd>
              </button>
              <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={cn(action, "w-11 justify-center px-0 lg:hidden")}>
                <Search size={20} aria-hidden="true" />
              </button>
              <CurrencySelect className="hidden lg:flex" />
              <ThemeToggle className="hidden lg:flex" />
              <Link
                href={user ? "/account" : "/auth/login"}
                className={cn(action, "hidden lg:inline-flex")}
                aria-label={user ? `Account${persona ? `, ${persona}` : ""}` : "Sign in"}
              >
                {user && avatar ? (
                  <Image src={avatar} alt="" width={24} height={24} unoptimized className="size-6" />
                ) : (
                  <User size={20} aria-hidden="true" />
                )}
                <span className="hidden max-w-[12ch] truncate xl:inline">{user ? persona ?? "Account" : "Sign in"}</span>
              </Link>
              <button
                type="button"
                onClick={openSheet}
                aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
                data-cart-target=""
                className={cn(action, "-mr-2 min-w-11 justify-center lg:mr-0")}
              >
                <ClipboardList size={20} aria-hidden="true" />
                <span className="hidden min-[1152px]:inline">Cart</span>
                <CartCount count={itemCount} bump={cartBounce} />
              </button>
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Menu" className={cn(action, "-mr-2 w-11 justify-center px-0 lg:hidden")}>
                <Menu size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="hang-rail absolute inset-x-0 bottom-0" />
          <div className="hidden lg:block">
            <CatalogueIndex
              id={indexId}
              open={indexOpen}
              categories={categories}
              activeSlug={catalogSlug}
              onClose={(restore) => closeIndex(0, restore)}
              onPointerEnter={() => window.clearTimeout(indexTimer.current)}
              onPointerLeave={() => closeIndex(250)}
            />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} activeSlug={catalogSlug} activeRoot={activeRoot} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} categories={categories} />
      <CartSheet />
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) return <CheckoutHeader />;
  return <StoreHeader />;
}
