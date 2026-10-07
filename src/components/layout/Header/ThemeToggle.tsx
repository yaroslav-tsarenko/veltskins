"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { Segmented } from "@/components/ui/Choice";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ variant = "icon", className }: { variant?: "icon" | "row"; className?: string }) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const label = theme === "light" ? "Switch to evening viewing" : "Switch to daylight hours";

  if (variant === "row") {
    return (
      <div className={cn("flex min-h-14 items-center justify-between gap-4", className)}>
        <span className="text-step-0 text-ink">Viewing</span>
        <Segmented
          label="Viewing"
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Daylight" },
            { value: "dark", label: "Evening" },
          ]}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center rounded-control text-ink-muted transition-colors duration-[120ms] hover-device:hover:bg-surface-1 hover-device:hover:text-ink",
        className,
      )}
    >
      {theme === "light" ? <LightbulbOff size={18} aria-hidden="true" /> : <Lightbulb size={18} aria-hidden="true" />}
    </button>
  );
}
