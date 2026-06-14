import { cn } from "@/lib/utils";

export interface BarDatum {
  id: string;
  label: string;
  value: number;
  /** Colour of the bar top edge + fade. */
  color: string;
}

interface MiniBarChartProps {
  data: readonly BarDatum[];
  className?: string;
}

/** Compact bar chart: bright top cap over a colour-fading filled body. */
export function MiniBarChart({ data, className }: MiniBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={cn("flex items-end gap-2 md:gap-3", className)}>
      {data.map((d) => {
        const heightPct = Math.max(14, (d.value / max) * 100);
        return (
          <div key={d.id} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-base font-semibold">{d.value}</span>
            <div className="flex h-36 w-full items-end md:h-44">
              <div
                className="w-full origin-bottom overflow-hidden rounded-t-lg border-t-[3px]"
                style={{
                  height: `${heightPct}%`,
                  borderTopColor: d.color,
                  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${d.color} 85%, transparent) 0%, color-mix(in srgb, ${d.color} 12%, transparent) 100%)`,
                  animation: "labbor-bar-grow 0.5s var(--ease-smooth)",
                }}
              />
            </div>
            <span className="text-center text-micro leading-tight text-fg-muted">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
