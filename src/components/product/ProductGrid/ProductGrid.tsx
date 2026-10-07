"use client";

import { Lot, type SkinProduct } from "@/components/skin/Lot";
import { cn } from "@/lib/utils/cn";

interface ProductGridProps {
  products: SkinProduct[];
  columns?: 3 | 4;
  priorityCount?: number;
  headingLevel?: 2 | 3;
  anchors?: boolean;
  className?: string;
}

const ANCHOR_POSITIONS = new Set([0, 7]);

export function ProductGrid({ products, columns = 4, priorityCount = 0, headingLevel = 3, anchors = true, className }: ProductGridProps) {
  return (
    <div
      data-salon-grid=""
      className={cn(
        "grid min-w-0 auto-rows-auto grid-cols-2 gap-x-3 gap-y-8 lg:gap-x-6 lg:gap-y-11",
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, index) => {
        const anchor = anchors && ANCHOR_POSITIONS.has(index);
        return (
          <div
            key={product.id}
            className={cn("min-w-0", anchor && "col-span-2 lg:col-span-2 lg:row-span-2")}
          >
            <Lot
              product={product}
              variant={anchor ? "anchor" : "standard"}
              renderAspect={anchor ? "16/11" : "5/4"}
              priority={index < priorityCount}
              headingLevel={headingLevel}
              sizes={anchor ? "(min-width: 1280px) 700px, (min-width: 1024px) 60vw, 100vw" : "(min-width: 1280px) 340px, (min-width: 1024px) 30vw, 46vw"}
            />
          </div>
        );
      })}
    </div>
  );
}
