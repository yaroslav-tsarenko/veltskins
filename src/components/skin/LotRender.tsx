"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type RenderAspect = "5/4" | "16/11" | "3/4" | "1/1" | "free";

const ASPECT: Record<RenderAspect, string> = {
  "5/4": "aspect-[5/4]",
  "16/11": "aspect-[16/11]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  free: "",
};

export interface LotRenderProps {
  src?: string | null;
  alt: string;
  aspect?: RenderAspect;
  sizes?: string;
  priority?: boolean;
  compact?: boolean;
  spot?: boolean;
  className?: string;
  renderClassName?: string;
  viewTransition?: string;
  children?: ReactNode;
}

export function LotRender({
  src,
  alt,
  aspect = "5/4",
  sizes,
  priority,
  compact = false,
  spot = false,
  className,
  renderClassName,
  viewTransition,
  children,
}: LotRenderProps) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;
  return (
    <div
      data-render-box=""
      data-spot-surface={spot || undefined}
      className={cn("relative isolate", ASPECT[aspect], !show && "border border-line", className)}
    >
      {spot ? <span aria-hidden="true" className="spot-rake" /> : null}
      {show ? (
        <>
          <span aria-hidden="true" className={cn("cast-shadow", compact && "h-1.5")} />
          <div data-render="" data-depth="3" className={cn("lot-render", renderClassName)} style={viewTransition ? { viewTransitionName: viewTransition } : undefined}>
            <Image
              src={src as string}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes ?? (compact ? "120px" : "(min-width: 1280px) 360px, (min-width: 1024px) 30vw, 50vw")}
              className="object-contain"
              onError={() => setFailed(true)}
            />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 text-ink-muted">
          <ImageOff size={compact ? 16 : 24} aria-hidden="true" />
          {!compact ? <span className="eyebrow">No render</span> : null}
        </div>
      )}
      {children}
    </div>
  );
}
