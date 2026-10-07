import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type PlateVariant =
  | "classification"
  | "rarity"
  | "stattrak"
  | "souvenir"
  | "star"
  | "phase"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "count"
  | "indicator";

const VARIANT: Record<Exclude<PlateVariant, "souvenir">, string> = {
  classification: "border border-line text-rarity",
  rarity: "border border-line text-rarity",
  stattrak: "border border-ink text-ink",
  star: "border border-line text-rarity-gold",
  phase: "border border-line text-ink",
  neutral: "bg-surface-1 text-ink",
  success: "bg-success-wash text-success",
  warning: "bg-warning-wash text-warning",
  danger: "bg-danger-wash text-danger",
  info: "bg-info-wash text-info",
  count: "bg-brand text-on-brand font-semibold",
  indicator: "bg-brand text-on-brand font-semibold",
};

const DOT: Partial<Record<PlateVariant, string>> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export interface PlateProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: PlateVariant;
  size?: "sm" | "md";
  children: ReactNode;
}

export function Plate({ variant = "neutral", size = "md", className, children, ...rest }: PlateProps) {
  if (variant === "souvenir") {
    return (
      <span
        className={cn("inline-flex max-w-full shrink-0 items-center whitespace-nowrap font-display text-[0.8125rem] font-normal italic leading-none text-ink-muted", className)}
        {...rest}
      >
        {children}
      </span>
    );
  }
  const dot = DOT[variant];
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 whitespace-nowrap rounded-none font-mono font-medium uppercase leading-none tracking-[0.1em]",
        size === "sm" ? "h-[18px] px-1.5 text-[0.625rem]" : "h-[22px] px-2 text-data-sm",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {dot ? <span aria-hidden="true" className={cn("size-1.5 shrink-0", dot)} /> : null}
      <span className="inline-flex min-w-0 items-center gap-1 truncate">{children}</span>
    </span>
  );
}

const ORDER_STATUS_VARIANT: Record<string, PlateVariant> = {
  PENDING: "neutral",
  CONFIRMED: "info",
  PAID: "success",
  PROCESSING: "warning",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "neutral",
  FAILED: "danger",
};

export function statusPlateVariant(status: string): PlateVariant {
  return ORDER_STATUS_VARIANT[status.toUpperCase()] ?? "neutral";
}

export function StatusPlate({ status, label, className }: { status: string; label?: string; className?: string }) {
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <Plate variant={statusPlateVariant(status)} className={className}>
      {text}
    </Plate>
  );
}
