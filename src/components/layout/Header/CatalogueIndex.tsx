"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LotRender } from "@/components/skin/LotRender";
import { skinFace, type SkinProduct } from "@/components/skin/Lot";
import { WallLabel } from "@/components/skin/WallLabel";
import { INDEX_TYPES, navCategory } from "@/config/navigation";
import { findCategory, subtreeCount, type CategoryNode } from "@/lib/hooks/useCategoryTree";
import { cachedFetchJSON, readCached } from "@/lib/utils/reliable-fetch";

function usePreview(slug: string | null) {
  const [product, setProduct] = useState<SkinProduct | null>(null);
  useEffect(() => {
    if (!slug) return;
    const cacheKey = `index:preview:${slug}`;
    const cached = readCached<{ data: SkinProduct[] }>({ cacheKey, storage: "session" });
    if (cached) setProduct(cached.data?.find((p) => p.images?.length) ?? null);
    let cancelled = false;
    cachedFetchJSON<{ data: SkinProduct[] }>(`/api/products?category=${encodeURIComponent(slug)}&pageSize=4&inStock=true&sort=price-desc`, { cacheKey, storage: "session" })
      .then((res) => {
        if (!cancelled) setProduct(res.data?.find((p) => p.images?.length) ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return product;
}

export interface CatalogueIndexProps {
  id: string;
  open: boolean;
  categories: CategoryNode[];
  activeSlug?: string | null;
  onClose: (restoreFocus?: boolean) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

const headCls =
  "flex items-baseline justify-between gap-2 font-sans text-ui-md font-semibold uppercase tracking-[0.06em] text-ink decoration-1 underline-offset-4 hover-device:hover:underline";
const weaponCls =
  "relative flex min-h-7 items-baseline justify-between gap-3 py-0.5 text-ui-md text-ink-muted transition-colors duration-[120ms] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand after:opacity-0 hover-device:hover:text-ink hover-device:hover:after:opacity-100 focus-visible:text-ink aria-[current=page]:text-ink aria-[current=page]:after:opacity-100";

export function CatalogueIndex({ id, open, categories, activeSlug = null, onClose, onPointerEnter, onPointerLeave }: CatalogueIndexProps) {
  const [pointed, setPointed] = useState<string | null>(null);
  const focus = pointed ?? "knives";
  const preview = usePreview(open ? focus : null);
  const focusNode = findCategory(categories, focus);
  const focusName = navCategory(focus)?.name ?? focusNode?.name ?? "";

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const target = e.target as HTMLElement;
    const column = target.closest<HTMLElement>("[data-index-col]");
    if (!column) return;
    const columns = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-index-col]"));
    const links = Array.from(column.querySelectorAll<HTMLAnchorElement>("a"));
    const index = links.indexOf(target as HTMLAnchorElement);
    e.preventDefault();
    if (e.key === "ArrowDown") links[Math.min(links.length - 1, index + 1)]?.focus();
    else if (e.key === "ArrowUp") links[Math.max(0, index - 1)]?.focus();
    else {
      const ci = columns.indexOf(column);
      const next = columns[e.key === "ArrowRight" ? Math.min(columns.length - 1, ci + 1) : Math.max(0, ci - 1)];
      next?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  };

  if (!open) return null;

  const face = preview ? skinFace(preview.name, preview.skin) : null;

  return (
    <div
      id={id}
      data-catalogue-index=""
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && (e.currentTarget.contains(next) || (next as HTMLElement).closest?.("[data-index-trigger]"))) return;
        onClose(false);
      }}
      className="absolute inset-x-0 top-full z-50 max-h-[72vh] animate-panel-in overflow-y-auto bg-mount text-ink shadow-lg"
    >
      <div aria-hidden="true" className="hang-rail" />
      <div className="mx-auto grid max-w-container grid-cols-12 gap-x-7 gap-y-8 px-gutter py-8">
        <div className={cn("col-span-12 grid grid-cols-4 gap-x-7 gap-y-8", preview && face ? "xl:col-span-9" : "")}>
          {INDEX_TYPES.map((slug) => {
            const node = findCategory(categories, slug);
            const name = navCategory(slug)?.name ?? node?.name ?? slug;
            const children = (node?.children ?? []).filter((c) => subtreeCount(c) > 0);
            return (
              <div key={slug} data-index-col="" className="min-w-0">
                <Link href={`/catalog/${slug}`} onFocus={() => setPointed(slug)} onPointerEnter={() => setPointed(slug)} onClick={() => onClose(false)} className={headCls}>
                  <span>{name}</span>
                  {node ? <span className="font-mono text-data-sm font-normal normal-case tracking-normal text-ink-faint">{subtreeCount(node)}</span> : null}
                </Link>
                {children.length > 0 ? (
                  <ul className="m-0 mt-3 list-none p-0">
                    {children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/catalog/${child.slug}`}
                          aria-current={activeSlug === child.slug ? "page" : undefined}
                          onFocus={() => setPointed(child.slug)}
                          onPointerEnter={() => setPointed(child.slug)}
                          onClick={() => onClose(false)}
                          className={weaponCls}
                        >
                          <span className="min-w-0 truncate">{child.name}</span>
                          <span className="font-mono text-data-sm text-ink-faint">{subtreeCount(child)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
        {preview && face ? (
          <div data-index-col="" className="col-span-12 hidden min-w-0 border-l border-line pl-7 xl:col-span-3 xl:block">
            <div data-lot="" data-rarity={face.rarity} className="relative">
              <LotRender src={preview.images?.[0]?.url} alt="" sizes="260px" />
              <WallLabel face={face} sku={preview.sku} href={`/product/${preview.slug}`} headingLevel={3} className="mt-3.5" reserveLines={false} />
            </div>
            <Link
              href={`/catalog/${focus}`}
              onClick={() => onClose(false)}
              className="mt-5 inline-flex items-center gap-1.5 text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline"
            >
              All {focusName} lots
              {focusNode ? <span className="font-mono text-data-sm font-normal text-ink-muted">· {subtreeCount(focusNode)}</span> : null}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
