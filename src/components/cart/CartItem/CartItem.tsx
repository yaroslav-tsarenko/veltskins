"use client";

import { useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { LotRow } from "@/components/skin/Lot";
import { cartItemCap, useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { roundMoney } from "@/lib/pricing";
import { cn } from "@/lib/utils/cn";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  size?: "compact" | "full";
  onNavigate?: () => void;
  actions?: ReactNode;
}

export function CartItem({ item, size = "compact", onNavigate, actions }: CartItemProps) {
  const { updateQuantity, removeItem, itemCount } = useCart();
  const { convert, currency } = useCurrency();
  const lineTotal = roundMoney(convert(item.price) * item.quantity);
  const [removing, setRemoving] = useState(false);
  const full = size === "full";
  const cap = cartItemCap(item, itemCount);

  const remove = () => {
    setRemoving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => removeItem(item.productId, item.variantId), reduced ? 0 : 220);
  };

  return (
    <li
      data-cart-row=""
      className={cn("grid transition-[grid-template-rows,opacity] duration-[220ms] ease-[var(--ease-std)]", removing ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr]")}
    >
      <div className="relative min-h-0 overflow-hidden" onClickCapture={(e) => (e.target as HTMLElement).closest("a") && onNavigate?.()}>
        <LotRow
          name={item.name}
          href={`/product/${item.slug}`}
          imageUrl={item.imageUrl}
          sku={item.sku}
          skin={item.skin}
          size={full ? "md" : "sm"}
          className={full ? "py-6" : "py-4"}
          aside={<span className="price text-[0.9375rem] text-ink">{formatPrice(lineTotal, currency)}</span>}
        >
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            {cap > 1 ? (
              <QuantitySelector
                quantity={item.quantity}
                maxQuantity={cap}
                showStockHint={cap >= item.maxQuantity}
                size="compact"
                label={`Quantity of ${item.name}`}
                onChange={(qty) => updateQuantity(item.productId, qty, item.variantId)}
              />
            ) : (
              <span className="font-mono text-data text-ink-muted">1</span>
            )}
            <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {actions}
              <button
                type="button"
                onClick={remove}
                disabled={removing}
                className="relative z-[3] inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-ui-sm font-medium text-ink-muted decoration-1 underline-offset-[5px] hover-device:hover:text-ink hover-device:hover:underline"
              >
                <Trash2 size={16} aria-hidden="true" />
                Remove<span className="sr-only"> {item.name}</span>
              </button>
            </span>
          </div>
        </LotRow>
      </div>
    </li>
  );
}
