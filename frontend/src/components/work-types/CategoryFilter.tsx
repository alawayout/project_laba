"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (next: string) => void;
}

const LABELS: Record<string, string> = { all: "Все" };

/** Horizontal scrollable category chips. */
export function CategoryFilter({
  categories,
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {categories.map((cat) => {
        const active = cat === value;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              "shrink-0 rounded-pill px-5 py-2.5 text-base font-medium transition",
              active
                ? "bg-accent text-black"
                : "glass-soft text-fg-secondary hover:text-fg",
            )}
          >
            {LABELS[cat] ?? cat}
          </button>
        );
      })}
    </div>
  );
}
