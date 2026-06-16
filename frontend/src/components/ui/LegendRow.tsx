import { cn } from "@/lib/utils";

interface LegendRowProps {
  color: string;
  label: string;
  value: string;
  className?: string;
}

/** Colour dot + label + trailing value, used in earnings breakdowns. */
export function LegendRow({ color, label, value, className }: LegendRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-pill bg-surface-4/60 px-4 py-2.5",
        className,
      )}
    >
      <span
        className="h-5 w-5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="text-base text-fg-secondary">{label}</span>
      <span className="ml-auto text-base font-semibold">{value}</span>
    </div>
  );
}
