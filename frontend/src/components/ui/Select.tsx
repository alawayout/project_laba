"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  id: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (id: string) => void;
  tone?: "card" | "modal";
}

/** Dropdown field. reactbits AnimatedList-style menu, restyled. */
export function Select({
  label,
  value,
  options,
  onChange,
  tone = "modal",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);
  const bg = tone === "modal" ? "bg-[#262626]" : "bg-surface-5";

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3.5 rounded-field px-5 py-3.5 text-left",
          bg,
        )}
      >
        <span className="min-w-0">
          <span className="mb-1.5 block text-caption text-fg-muted">
            {label}
          </span>
          <span className="block text-lg font-medium">
            {selected?.label ?? "—"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 self-center text-fg-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden",
            "rounded-2xl border border-line bg-[#262626] shadow-modal",
          )}
        >
          {options.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className="block w-full px-5 py-3.5 text-left text-md transition hover:bg-[#333]"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
