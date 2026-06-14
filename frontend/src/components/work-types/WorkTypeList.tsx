import type { WorkType } from "@/lib/types";
import { WorkTypeCard } from "./WorkTypeCard";

interface WorkTypeListProps {
  items: WorkType[];
}

/** Responsive catalogue grid: 1 col mobile → 2 desktop. */
export function WorkTypeList({ items }: WorkTypeListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface-3 px-6 py-16 text-center text-md text-fg-muted">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <WorkTypeCard key={item.id} workType={item} />
      ))}
    </div>
  );
}
