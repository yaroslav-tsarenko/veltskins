"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw, RotateCw, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useNativeDialog } from "@/components/ui/Dialog";
import { LotRender } from "@/components/skin/LotRender";
import { ConditionGrid } from "@/components/skin/ConditionGrid";

function ZoomDialog({ open, onClose, src, alt }: { open: boolean; onClose: () => void; src: string | null; alt: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { ref, phase } = useNativeDialog(open, 220, closeRef);
  const [magnified, setMagnified] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  return (
    <dialog
      ref={ref}
      aria-label={`Zoomed view: ${alt}`}
      aria-modal="true"
      data-phase={phase}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-surface p-0 backdrop:bg-scrim transition-opacity duration-[220ms] data-[phase=closing]:opacity-0 data-[phase=open]:animate-fade-in"
    >
      {open || phase !== "closed" ? (
        <div className="relative z-[4] flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-end px-4 sm:px-6">
            <button ref={closeRef} type="button" onClick={onClose} className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-ui-md font-medium text-ink">
              <X size={20} aria-hidden="true" />
              Close
            </button>
          </div>
          <div
            className={cn("relative min-h-0 flex-1 overflow-hidden", magnified ? "cursor-zoom-out" : "cursor-zoom-in")}
            onPointerMove={(e) => {
              if (!magnified) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setOrigin({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setOrigin({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
              setMagnified((m) => !m);
            }}
          >
            {src ? (
              <div
                className="absolute inset-6 transition-transform duration-[300ms] ease-[var(--ease-hang)] sm:inset-16"
                style={{ transform: magnified ? "scale(2)" : "scale(1)", transformOrigin: `${origin.x}% ${origin.y}%` }}
              >
                <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
              </div>
            ) : null}
          </div>
          <p className="m-0 shrink-0 px-4 py-3 text-center text-ui-sm text-ink-muted">
            {magnified ? "Move across the render to look closer. Click to zoom out." : "Click or tap the render to zoom to 2×."}
          </p>
        </div>
      ) : null}
    </dialog>
  );
}

export interface HungRenderProps {
  src: string | null;
  alt: string;
  rarity?: string;
  exterior: string | null;
  productId: string;
}

const control =
  "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-control px-2 text-ui-md font-medium text-ink-muted transition-colors duration-[120ms] hover-device:hover:text-ink aria-pressed:text-ink";

export function HungRender({ src, alt, rarity, exterior, productId }: HungRenderProps) {
  const hintId = useId();
  const [rotating, setRotating] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [view, setView] = useState(0);

  return (
    <div data-inspection="" className="min-w-0">
      <div aria-hidden="true" className="hang-rail relative">
        <span className="hook-tick" style={{ left: "16%" }} />
      </div>
      <span aria-hidden="true" className="block h-8 w-px bg-wire" style={{ marginLeft: "16%" }} />
      <div
        data-scene="inspect"
        data-rarity={rarity}
        data-rotate={rotating ? "on" : "off"}
        data-view={view}
        tabIndex={0}
        role="group"
        aria-roledescription="Hung render"
        aria-label={alt}
        aria-describedby={hintId}
        onKeyDown={(e) => {
          if (e.key === "+" || e.key === "=") setZoom(true);
          if (e.key === "0") setView((v) => v + 1);
        }}
        onClick={(e) => {
          if (window.matchMedia("(pointer: coarse)").matches && !(e.target as HTMLElement).closest("button")) setZoom(true);
        }}
        className="relative"
      >
        <LotRender
          src={src}
          alt={alt}
          aspect="free"
          spot
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[5/4] lg:aspect-auto lg:min-h-[520px]"
          viewTransition={`render-${productId}`}
        >
          <canvas data-spot="webgl" aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] hidden size-full" />
        </LotRender>
        <p id={hintId} className="sr-only">
          With the render focused, arrow keys rotate the skin when rotation is on, plus or equals opens the zoom view and zero resets the view.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 max-lg:hidden">
        <button type="button" data-inspect-control="rotate" aria-pressed={rotating} onClick={() => setRotating((r) => !r)} className={control}>
          <RotateCw size={18} aria-hidden="true" />
          Rotate
        </button>
        <button type="button" data-inspect-control="reset" onClick={() => setView((v) => v + 1)} className={control}>
          <RotateCcw size={18} aria-hidden="true" />
          Reset view
        </button>
        <button type="button" data-inspect-control="zoom" onClick={() => setZoom(true)} className={control}>
          <ZoomIn size={18} aria-hidden="true" />
          Zoom
        </button>
      </div>
      {exterior ? (
        <ConditionGrid exterior={exterior} size="md" className="mt-8" />
      ) : (
        <p className="m-0 mt-8 font-mono text-data text-ink-muted">Not painted: this knife carries no finish, so it has no condition band and no float range.</p>
      )}
      <ZoomDialog open={zoom} onClose={() => setZoom(false)} src={src} alt={alt} />
    </div>
  );
}
