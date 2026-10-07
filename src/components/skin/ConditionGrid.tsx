import type { ReactNode } from "react";
import { EXTERIORS, exteriorDef, floatRangeLabel, formatFloat } from "@/lib/skins/cs2";
import { cn } from "@/lib/utils/cn";

export function exteriorReadout(code: string | null | undefined): string | null {
  const e = exteriorDef(code);
  if (!e) return null;
  return `${e.label} · float ${formatFloat(e.floatMin)}–${formatFloat(e.floatMax)}`;
}

export function conditionLabel(code: string | null | undefined): string {
  const e = exteriorDef(code);
  if (!e) return "Condition not painted";
  return `Condition ${e.label}, float range ${formatFloat(e.floatMin)} to ${formatFloat(e.floatMax)}`;
}

const CELL = {
  lg: { box: "h-11 text-[0.875rem]", width: "min-w-14" },
  md: { box: "h-7 text-data-sm", width: "min-w-8" },
  sm: { box: "h-[22px] text-[0.625rem]", width: "min-w-6" },
  xs: { box: "h-[15px] text-[0.5625rem]", width: "w-[18px]" },
} as const;

export type ConditionSize = keyof typeof CELL;

export function ConditionGrid({
  exterior,
  size = "md",
  decorative = false,
  readout = true,
  className,
}: {
  exterior: string | null | undefined;
  size?: ConditionSize;
  decorative?: boolean;
  readout?: boolean;
  className?: string;
}) {
  const current = exteriorDef(exterior);
  const text = exteriorReadout(exterior);
  const grid = (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : conditionLabel(exterior)}
      aria-hidden={decorative || undefined}
      className="flex shrink-0 gap-px"
    >
      {EXTERIORS.map((e) => {
        const on = e.code === current?.code;
        return (
          <span
            key={e.code}
            className={cn(
              "grid place-items-center border border-line font-mono font-medium leading-none",
              size === "xs" ? "" : "flex-1",
              CELL[size].box,
              CELL[size].width,
              on ? "border-ink bg-ink text-surface" : "text-ink-faint",
            )}
          >
            {e.code}
          </span>
        );
      })}
    </div>
  );
  if (!readout || !text) return <div className={cn("min-w-0", className)}>{grid}</div>;
  const [name, range] = text.split(" · ");
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4", className)}>
      {grid}
      <p className="m-0 min-w-0 text-ui-sm text-ink">
        {name}
        <span className="ml-2 font-mono text-data text-ink-muted">{range}</span>
      </p>
    </div>
  );
}

export function ConditionStrip({ exterior, className }: { exterior: string | null | undefined; className?: string }) {
  return <ConditionGrid exterior={exterior} size="xs" decorative readout={false} className={cn("shrink-0", className)} />;
}

export interface ConditionCell {
  code: string;
  count: number;
}

export function ConditionCells({
  selected,
  counts,
  onToggle,
  className,
}: {
  selected: string[];
  counts: Record<string, number>;
  onToggle: (code: string) => void;
  className?: string;
}) {
  const active = new Set(selected.map((c) => c.toUpperCase()));
  return (
    <div className={cn("flex gap-px", className)}>
      {EXTERIORS.map((e) => {
        const on = active.has(e.code);
        const count = counts[e.code] ?? 0;
        const disabled = count === 0 && !on;
        return (
          <button
            key={e.code}
            type="button"
            aria-pressed={on}
            disabled={disabled}
            onClick={() => onToggle(e.code)}
            aria-label={`${e.label}, ${formatFloat(e.floatMin)} to ${formatFloat(e.floatMax)}, ${count} ${count === 1 ? "lot" : "lots"}`}
            className={cn(
              "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 border border-line font-mono leading-none transition-colors duration-[120ms]",
              on ? "border-ink bg-ink text-surface" : disabled ? "cursor-not-allowed text-ink-faint opacity-50" : "cursor-pointer text-ink hover-device:hover:border-ink-muted",
            )}
          >
            <span className="text-data-sm font-medium">{e.code}</span>
            <span className={cn("text-[0.625rem]", on ? "text-surface" : "text-ink-muted")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ConditionReadout({ exterior, children, className }: { exterior?: string | null; children?: ReactNode; className?: string }) {
  const e = exteriorDef(exterior);
  const range = e ? floatRangeLabel(e.floatMin, e.floatMax) : null;
  return (
    <p className={cn("m-0 text-ui-sm text-ink", className)}>
      {e ? e.label : "Not painted"}
      {range ? <span className="ml-2 font-mono text-data text-ink-muted">{range}</span> : null}
      {children}
    </p>
  );
}
