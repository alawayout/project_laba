import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlassTone = "glass" | "glass-soft" | "solid";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: GlassTone;
  children: ReactNode;
}

const TONES: Record<GlassTone, string> = {
  glass: "glass",
  "glass-soft": "glass-soft",
  solid: "bg-surface-3 border border-line",
};

/** Translucent panel — the base surface of the glass design language. */
export function GlassCard({
  tone = "glass",
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn("rounded-panel p-5 md:p-6", TONES[tone], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
