import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "lime" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
  leftIcon?: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  lime: "bg-accent text-black hover:brightness-105",
  ghost: "bg-surface-5 text-fg hover:bg-[#3a3a3a]",
};

/** Pill button. reactbits-derived, restyled to the LABBOR design code. */
export function Button({
  variant = "lime",
  block = false,
  leftIcon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-pill",
        "px-6 py-3.5 text-base font-semibold transition",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        "md:text-lg md:px-7 md:py-4",
        VARIANTS[variant],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {children}
    </button>
  );
}
