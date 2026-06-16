import { GlassCard } from "@/components/ui";
import type { DistributionSlice } from "@/lib/types";

interface DistributionCardProps {
  title: string;
  slices: DistributionSlice[];
}

/** Distribution as labelled proportion bars (status / work-type share). */
export function DistributionCard({ title, slices }: DistributionCardProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <GlassCard>
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-4">
        {slices.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <div key={s.id}>
              <div className="mb-1.5 flex items-center justify-between text-base">
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </span>
                <span className="text-fg-muted">
                  {s.value}{" "}
                  <span className="text-caption">· {pct}%</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-pill bg-surface-5">
                <span
                  className="block h-full rounded-pill"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
