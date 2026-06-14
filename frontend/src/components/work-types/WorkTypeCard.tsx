import { Clock } from "lucide-react";
import { GlassCard } from "@/components/ui";
import type { WorkType } from "@/lib/types";
import { cn, formatRub } from "@/lib/utils";

interface WorkTypeCardProps {
  workType: WorkType;
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

/** Catalogue card: name, category, price, lead time, stage chips. */
export function WorkTypeCard({ workType }: WorkTypeCardProps) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-caption text-fg-muted">
            {workType.category}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-balance">
            {workType.name}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-pill px-3 py-1.5 text-caption font-medium",
            workType.active ? "bg-done text-done-fg" : "bg-wait text-wait-fg",
          )}
        >
          {workType.active ? "Активна" : "Скрыта"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-2xl font-semibold">
          {formatRub(workType.price)} ₽
        </span>
        <span className="flex items-center gap-2 text-base text-fg-tertiary">
          <Clock className="h-4 w-4" />
          {workType.leadDays} {pluralDays(workType.leadDays)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {workType.stages.map((s, i) => (
          <span
            key={s.id}
            className="rounded-pill bg-surface-5 px-3 py-1.5 text-caption text-fg-secondary"
          >
            {i + 1}. {s.name}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
