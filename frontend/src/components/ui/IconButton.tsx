import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IconButtonTone = "default" | "lime" | "warn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: IconButtonTone;
  label: string; // required for a11y
  children: ReactNode; // a lucide icon
}

const TONES: Record<IconButtonTone, string> = {
  default: "bg-surface-5 text-fg-tertiary hover:bg-[#3a3a3a] hover:text-fg",
  lime: "bg-accent-soft text-accent hover:bg-done",
  warn: "bg-surface-5 text-fg-tertiary hover:bg-dead hover:text-dead-fg",
};

/** Round 44px icon-only button (meets minimum tap target). */
export function IconButton({
  tone = "default",
  label,
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-pill transition",
        "active:scale-95 [&>svg]:h-5 [&>svg]:w-5",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
