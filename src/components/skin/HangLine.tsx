import { cn } from "@/lib/utils/cn";

export function HangLine({ hooks = 0, active = false, reveal = false, className }: { hooks?: number; active?: boolean; reveal?: boolean; className?: string }) {
  const positions = hooks > 0 ? Array.from({ length: hooks }, (_, i) => ((i + 0.5) / hooks) * 100) : [];
  return (
    <div aria-hidden="true" data-rail="" data-reveal={reveal ? "in" : undefined} className={cn("hang-rail w-full origin-left", className)}>
      {positions.map((left, i) => (
        <span key={i} className="hook-tick" data-active={active || undefined} style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}

export function HookTick({ active = false, className }: { active?: boolean; className?: string }) {
  return <span aria-hidden="true" data-active={active || undefined} className={cn("block h-[7px] w-0.5 bg-rail", active && "bg-brand", className)} />;
}

export function Wire({ length = 24, offset = "14%", className }: { length?: number; offset?: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("block w-full", className)}>
      <span className="block h-[7px] w-0.5 bg-rail" style={{ marginLeft: offset }} />
      <span className="wire block" style={{ height: length, marginLeft: offset }} />
    </span>
  );
}
