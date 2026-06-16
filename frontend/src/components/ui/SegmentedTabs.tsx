"use client";

import { cn } from "@/lib/utils";

export interface TabOption {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  options: readonly TabOption[];
  value: string;
  onChange: (id: string) => void;
  /** "pill" = filled lime active (Все/В работе); "text" = underline (Месяц/Неделя). */
  variant?: "pill" | "text";
  className?: string;
}

/** Two/few-option switch. Pill or underlined-text styles. */
export function SegmentedTabs({
  options,
  value,
  onChange,
  variant = "pill",
  className,
}: SegmentedTabsProps) {
  if (variant === "text") {
    return (
      <div className={cn("flex items-center gap-6", className)}>
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "relative pb-1.5 text-md font-medium transition-colors",
                active ? "text-fg" : "text-fg-muted hover:text-fg-secondary",
              )}
            >
              {opt.label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-pill bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-stretch gap-2", className)}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 rounded-pill px-5 py-3 text-center text-md font-semibold transition",
              active
                ? "bg-accent text-black"
                : "text-fg-secondary hover:bg-surface-4",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
