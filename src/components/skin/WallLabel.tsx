import type { ReactNode } from "react";
import Link from "next/link";
import { exteriorDef, floatRangeLabel } from "@/lib/skins/cs2";
import { cn } from "@/lib/utils/cn";
import { StarMark } from "./StarMark";
import type { SkinFace } from "./face";

export function lotNumber(sku: string | null | undefined): string | null {
  return sku ? sku.toUpperCase() : null;
}

export function LotNumber({ sku, className }: { sku: string | null | undefined; className?: string }) {
  const value = lotNumber(sku);
  if (!value) return null;
  return (
    <p className={cn("label-caps m-0 truncate text-ink-faint", className)}>
      <span className="sr-only">Lot number </span>
      <span aria-hidden="true">Lot </span>
      {value}
    </p>
  );
}

export function WeaponLine({ face, className }: { face: SkinFace; className?: string }) {
  if (!face.weaponLine) return null;
  return (
    <p className={cn("label-caps m-0 flex min-w-0 items-center gap-1.5 text-ink-muted", className)}>
      {face.star ? <StarMark size={10} label /> : null}
      <span className="truncate">{face.weaponLine}</span>
    </p>
  );
}

export function ConditionLine({ face, className }: { face: SkinFace; className?: string }) {
  const ext = exteriorDef(face.exteriorCode);
  const range = ext ? floatRangeLabel(ext.floatMin, ext.floatMax) : null;
  return (
    <p className={cn("m-0 min-w-0 text-ui-sm leading-[1.4] text-ink", className)}>
      {ext ? ext.label : "Not painted"}
      {range ? <span className="ml-2 whitespace-nowrap font-mono text-data text-ink-muted">{range}</span> : null}
    </p>
  );
}

export function ClassificationLine({ face, className }: { face: SkinFace; className?: string }) {
  if (!face.rarityLabel) return null;
  return (
    <p className={cn("label-caps m-0 text-rarity transition-colors duration-[120ms]", className)}>
      <span aria-hidden="true">Classification · </span>
      <span className="sr-only">Classification: </span>
      {face.rarityLabel}
    </p>
  );
}

export interface WallLabelProps {
  face: SkinFace;
  sku?: string | null;
  href?: string | null;
  headingLevel?: 2 | 3 | 4;
  size?: "standard" | "anchor" | "flush";
  reserveLines?: boolean;
  children?: ReactNode;
  className?: string;
}

export function WallLabel({ face, sku, href, headingLevel = 3, size = "standard", reserveLines = true, children, className }: WallLabelProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const anchor = size === "anchor";
  return (
    <div className={cn("wall-label min-w-0", size === "flush" ? "w-full" : "w-[88%]", anchor ? "px-5 pb-5 pt-4" : "px-3.5 pb-3.5 pt-3", className)}>
      <LotNumber sku={sku} />
      <WeaponLine face={face} className="mt-2" />
      <Heading
        className={cn(
          "m-0 mt-1.5 font-display font-medium tracking-normal text-ink",
          anchor ? "text-step-3 leading-[1.14]" : "text-step-1 leading-[1.24]",
          reserveLines && !anchor && "line-clamp-2 min-h-[2.48em] [overflow-wrap:anywhere]",
        )}
      >
        {href ? (
          <Link
            href={href}
            data-lot-link=""
            className="outline-none after:absolute after:inset-0 after:bottom-auto after:top-[-120%] after:z-[2] after:h-[220%] hover-device:hover:underline hover-device:hover:decoration-1 hover-device:hover:underline-offset-4"
          >
            {face.name}
          </Link>
        ) : (
          face.name
        )}
      </Heading>
      <ConditionLine face={face} className="mt-2" />
      <ClassificationLine face={face} className="mt-2" />
      {children}
    </div>
  );
}
