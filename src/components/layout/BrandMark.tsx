import type { SVGProps } from "react";
import { cn } from "@/lib/utils/cn";

type MarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  title?: string;
};

export function Monogram({ title, className, size = 28, ...rest }: MarkProps & { size?: number }) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...rest}
    >
      <rect width="512" height="512" fill="var(--color-accent)" />
      <path
        fill="var(--color-on-accent)"
        d="M138 115h14v26h-14zM360 115h14v26h-14zM48 141h416v14H48zM150 335h212v32H150zM186 381h140v16H186z"
      />
      <path fill="none" stroke="var(--color-on-accent)" strokeWidth="14" strokeLinejoin="miter" d="M145 155 256 335 367 155" />
    </svg>
  );
}

export function Wordmark({ title, className, size = 20 }: { title?: string; className?: string; size?: number }) {
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      className={cn(
        "relative inline-block whitespace-nowrap font-display font-medium leading-none tracking-[-0.005em] text-ink",
        "before:absolute before:-top-[0.48em] before:-left-[0.09em] before:-right-[0.09em] before:h-px before:bg-brand before:content-['']",
        className,
      )}
      style={{ fontSize: `${size / 0.67}px`, fontVariationSettings: '"opsz" 40' }}
    >
      Veltskins
    </span>
  );
}

export function BrandLockup({ size = 20, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Monogram size={Math.round(size * 1.6)} title={title} />
      <Wordmark size={size} />
    </span>
  );
}

export function BrandMark({ size = 28, className }: { size?: number; className?: string }) {
  return <Monogram size={size} className={className} />;
}
