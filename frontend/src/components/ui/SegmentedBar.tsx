import { cn } from "@/lib/utils";

export interface BarSegment {
  id: string;
  value: number;
  /** Any CSS colour (token var or hex). */
  color: string;
}

interface SegmentedBarProps {
  segments: readonly BarSegment[];
  /** Only positive values contribute to the filled proportions. */
  className?: string;
}

/** Horizontal multi-colour proportion bar (earnings split). */
export function SegmentedBar({ segments, className }: SegmentedBarProps) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  return (
    <div
      className={cn(
        "flex h-3 w-full overflow-hidden rounded-pill bg-surface-5",
        className,
      )}
      role="img"
      aria-label="Распределение"
    >
      {total > 0 &&
        segments.map((s) => {
          const pct = (Math.max(0, s.value) / total) * 100;
          if (pct === 0) return null;
          return (
            <span
              key={s.id}
              className="h-full first:rounded-l-pill last:rounded-r-pill"
              style={{ width: `${pct}%`, background: s.color }}
            />
          );
        })}
    </div>
  );
}
