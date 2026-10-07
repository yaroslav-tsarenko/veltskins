import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft" | "light" | "flat" | "bordered" | "steam";
export type ButtonColor = "primary" | "danger" | "success" | "warning" | "default";
type Kind = "claret" | "ruled" | "text" | "danger" | "danger-text" | "account";

const SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "h-9 px-3.5 text-ui-sm",
  md: "h-[46px] px-[22px] text-ui-md",
  lg: "h-[54px] px-[30px] text-step-0",
};

const TEXT_SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "min-h-9 text-ui-sm",
  md: "min-h-[46px] text-ui-md",
  lg: "min-h-[54px] text-step-0",
};

function resolveKind(variant: ButtonVariant, color?: ButtonColor): Kind {
  if (variant === "steam") return "account";
  if (color === "danger") {
    return variant === "flat" || variant === "light" || variant === "ghost" || variant === "tertiary" || variant === "danger-soft"
      ? "danger-text"
      : "danger";
  }
  switch (variant) {
    case "secondary":
    case "outline":
    case "bordered":
      return "ruled";
    case "tertiary":
    case "ghost":
    case "light":
    case "flat":
      return "text";
    case "danger":
      return "danger";
    case "danger-soft":
      return "danger-text";
    default:
      return "claret";
  }
}

const BOXED_DISABLED = "rounded-control bg-surface-1 text-ink-faint";

function kindClasses(kind: Kind, disabled: boolean) {
  if (kind === "claret") {
    if (disabled) return BOXED_DISABLED;
    return "rounded-control bg-brand text-on-brand hover-device:hover:bg-brand-hover active:translate-y-px";
  }
  if (kind === "account") {
    if (disabled) return BOXED_DISABLED;
    return "rounded-control bg-ink text-surface hover-device:hover:bg-ink-muted active:translate-y-px";
  }
  if (kind === "danger") {
    if (disabled) return BOXED_DISABLED;
    return "rounded-control bg-danger text-on-danger hover-device:hover:brightness-[1.06] active:translate-y-px";
  }
  if (kind === "ruled") {
    if (disabled) return "rounded-control border border-line text-ink-faint";
    return "rounded-control border border-control text-ink hover-device:hover:border-ink hover-device:hover:bg-surface-1 active:translate-y-px active:bg-brand-wash";
  }
  if (kind === "danger-text") {
    if (disabled) return "text-ink-faint";
    return "font-sans font-medium normal-case tracking-normal text-danger decoration-1 underline-offset-[5px] hover-device:hover:underline";
  }
  if (disabled) return "font-sans font-medium normal-case tracking-normal text-ink-faint";
  return "font-sans font-medium normal-case tracking-normal text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline active:underline active:decoration-accent-ink";
}

export function buttonClasses({
  variant = "primary",
  color,
  size = "md",
  isIconOnly = false,
  fullWidth = false,
  disabled = false,
  className,
}: {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: "sm" | "md" | "lg";
  isIconOnly?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const kind = resolveKind(variant, color);
  if (isIconOnly) {
    return cn(
      "relative inline-flex shrink-0 items-center justify-center size-10 touch-device:size-11 rounded-control transition-colors duration-[120ms]",
      disabled
        ? "text-ink-faint cursor-not-allowed"
        : cn(kind === "danger" || kind === "danger-text" ? "text-danger" : "text-ink", "cursor-pointer hover-device:hover:bg-surface-1 active:bg-brand-wash"),
      className,
    );
  }
  const isText = kind === "text" || kind === "danger-text";
  return cn(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none leading-none",
    !isText && "font-sans font-semibold uppercase tracking-[0.06em]",
    "transition-[transform,color,background-color,border-color,box-shadow,filter] duration-[120ms] ease-[var(--ease-std)]",
    "focus-visible:outline-offset-2",
    isText ? TEXT_SIZE[size] : SIZE[size],
    kindClasses(kind, disabled),
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    fullWidth && "w-full",
    className,
  );
}
