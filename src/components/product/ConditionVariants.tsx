"use client";

import Link from "next/link";
import { LotRender } from "@/components/skin/LotRender";
import { ConditionGrid } from "@/components/skin/ConditionGrid";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { Plate } from "@/components/ui/Plate";
import { skinFace, type SkinProduct } from "@/components/skin/Lot";

export interface VariantRow {
  product: SkinProduct;
}

export function ConditionVariants({ rows, title }: { rows: VariantRow[]; title: string }) {
  return (
    <section aria-labelledby="variants-title" data-section="variants" className="mt-20 lg:mt-24">
      <h2 id="variants-title" className="m-0 font-display text-step-3 font-medium leading-[1.14] text-ink">
        {title}
      </h2>
      <ul className="m-0 mt-8 list-none border-t border-line p-0">
        {rows.map(({ product }) => {
          const face = skinFace(product.name, product.skin);
          return (
            <li
              key={product.id}
              data-rarity={face.rarity}
              className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 border-b border-line py-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)_140px]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="block w-24 shrink-0">
                  <LotRender src={product.images?.[0]?.url} alt="" compact sizes="96px" />
                </span>
                <span className="min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block text-ui-md font-medium text-ink decoration-1 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
                  >
                    {face.exteriorLabel}
                  </Link>
                  <span className="mt-1.5 flex flex-wrap items-center gap-2">
                    {face.stattrak ? (
                      <Plate variant="stattrak" size="sm" aria-label="StatTrak">
                        ST
                      </Plate>
                    ) : null}
                    {face.souvenir ? <Plate variant="souvenir">Souvenir</Plate> : null}
                  </span>
                </span>
              </div>
              <div className="hidden md:block">
                <ConditionGrid exterior={face.exteriorCode} size="sm" decorative readout={false} className="max-w-[220px]" />
              </div>
              <div className="text-right">
                <PriceDisplay price={Number(product.price)} size="sm" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
