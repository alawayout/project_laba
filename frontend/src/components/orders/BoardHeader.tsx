"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, Plus, Rows3, X } from "lucide-react";

export type BoardView = "row" | "grid";

export interface BoardFilter {
  id: string;
  name: string;
}

interface BoardHeaderProps {
  filters: BoardFilter[];
  onRemoveFilter: (id: string) => void;
  onAddFilter: () => void;
  view: BoardView;
  onViewChange: (view: BoardView) => void;
}

/** Шапка доски «В работе»: фильтры-чипы + переключатель вида. */
export function BoardHeader({
  filters,
  onRemoveFilter,
  onAddFilter,
  view,
  onViewChange,
}: BoardHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
        <h2 className="shrink-0 text-3xl font-semibold">В работе</h2>

        {filters.map((filter) => (
          <span
            key={filter.id}
            className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-surface-3 py-2.5 pl-4 pr-3 text-base text-fg-secondary"
          >
            {filter.name}
            <button
              type="button"
              aria-label={`Убрать фильтр ${filter.name}`}
              onClick={() => onRemoveFilter(filter.id)}
              className="text-fg-muted transition hover:text-fg [&_svg]:size-4"
            >
              <X />
            </button>
          </span>
        ))}

        <button
          type="button"
          aria-label="Добавить фильтр"
          onClick={onAddFilter}
          className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-surface-3 text-fg-secondary transition hover:bg-surface-4 hover:text-fg [&_svg]:size-5"
        >
          <Plus />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 rounded-pill bg-surface-2 p-1.5">
        <ViewButton
          active={view === "grid"}
          label="Сеткой"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid />
        </ViewButton>
        <ViewButton
          active={view === "row"}
          label="Лентой"
          onClick={() => onViewChange("row")}
        >
          <Rows3 />
        </ViewButton>
      </div>
    </div>
  );
}

interface ViewButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ViewButton({ active, label, onClick, children }: ViewButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-pill transition [&_svg]:size-5",
        active
          ? "bg-accent text-black"
          : "text-fg-muted hover:bg-surface-4 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
