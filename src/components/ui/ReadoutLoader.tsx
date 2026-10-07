import { cn } from "@/lib/utils/cn";

export interface ReadoutLoaderProps {
  label?: string;
  block?: boolean;
  className?: string;
}

export function ReadoutLoader({ label = "Loading", block = false, className }: ReadoutLoaderProps) {
  const loader = (
    <span role="status" className={cn("inline-flex items-center", className)}>
      <span aria-hidden="true" className="relative block h-px w-[72px] overflow-hidden bg-line motion-reduce:hidden">
        <span className="absolute inset-0 origin-left bg-brand [animation:line-draw_900ms_var(--ease-in-out)_infinite]" />
      </span>
      <span className="meta hidden text-ink-muted motion-reduce:inline">{label}…</span>
      <span className="sr-only motion-reduce:hidden">{label}</span>
    </span>
  );
  if (!block) return loader;
  return <div className="flex items-center justify-center px-4 py-16">{loader}</div>;
}

export function SkeletonBar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block h-3 bg-surface-1", className)} />;
}
