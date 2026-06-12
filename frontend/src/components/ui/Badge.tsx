import { Check, Repeat, TriangleAlert, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { getStatusMeta } from "@/lib/status-meta";
import { cn } from "@/lib/utils";

export type BadgeSize = "sm" | "md";

interface BadgeProps {
  status: OrderStatus;
  /** Override the label (e.g. "Срочно" on a `dead` badge). */
  label?: string;
  size?: BadgeSize;
  className?: string;
}

const LEADING_ICON: Partial<Record<OrderStatus, LucideIcon>> = {
  done: Check,
  dead: TriangleAlert,
  clinic: Repeat,
};

const SIZES: Record<BadgeSize, string> = {
  sm: "text-caption px-3 py-1.5 gap-1.5 [&>svg]:h-3.5 [&>svg]:w-3.5",
  md: "text-caption px-3.5 py-2 gap-2 [&>svg]:h-4 [&>svg]:w-4",
};

/** Status pill. Shows a lucide glyph for terminal states, a dot otherwise. */
export function Badge({ status, label, size = "md", className }: BadgeProps) {
  const meta = getStatusMeta(status);
  const Icon = LEADING_ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-pill font-semibold",
        meta.className,
        SIZES[size],
        className,
      )}
    >
      {Icon ? (
        <Icon strokeWidth={2.4} />
      ) : (
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      )}
      {label ?? meta.label}
    </span>
  );
}
