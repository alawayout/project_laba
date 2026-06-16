import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  block?: boolean;
}

/** Пунктирная кнопка-добавление (примерка, вид работы и т. п.). */
export function DashedButton({
  icon,
  block = false,
  className,
  children,
  type = "button",
  ...rest
}: DashedButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-field border border-dashed border-[#4a4a4a]",
        "px-6 py-4 text-md font-medium text-fg-tertiary transition",
        "hover:border-fg-muted hover:text-fg [&_svg]:size-5",
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
