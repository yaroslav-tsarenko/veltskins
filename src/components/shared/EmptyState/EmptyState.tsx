"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  headingLevel?: 1 | 2 | 3;
  align?: "center" | "start";
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function EmptyMount({ className, cut = false }: { className?: string; cut?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("flex w-[168px] flex-col items-center", className)}>
      <span className="relative block h-px w-full bg-rail">
        <span className="absolute bottom-0 left-1/2 h-[7px] w-0.5 -translate-x-1/2 bg-rail" />
      </span>
      <span className={cn("block w-px bg-wire", cut ? "h-6" : "h-5")} />
      {cut ? null : <span className="block h-[134px] w-full border border-line" />}
    </div>
  );
}

export function EmptyBay({ className }: { className?: string }) {
  return <EmptyMount className={className} />;
}

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  headingLevel = 2,
  align = "center",
  children,
  className,
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-3 px-4 py-16", centered ? "items-center text-center" : "items-start", className)}>
      <EmptyMount />
      <Heading className="mt-6 font-display text-step-2 font-medium leading-[1.2] text-ink">{title}</Heading>
      {subtitle ? <p className={cn("max-w-[48ch] text-ink-muted", centered && "mx-auto")}>{subtitle}</p> : null}
      {children}
      {(actionLabel && (actionHref || onAction)) || (secondaryLabel && secondaryHref) ? (
        <div className={cn("mt-3 flex flex-wrap items-center gap-x-6 gap-y-3", centered && "justify-center")}>
          {actionLabel && actionHref ? (
            <Button as={Link} href={actionHref} variant="primary">
              {actionLabel}
            </Button>
          ) : actionLabel && onAction ? (
            <Button variant="primary" onPress={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {secondaryLabel && secondaryHref ? (
            <Button as={Link} href={secondaryHref} variant="ghost">
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
