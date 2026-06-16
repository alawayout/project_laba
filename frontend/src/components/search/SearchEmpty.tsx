import { SearchX } from "lucide-react";

/** Пустая выдача поиска. */
export function SearchEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-12 text-fg-muted">
      <SearchX className="size-9" />
      <p className="text-md">Ничего не найдено</p>
    </div>
  );
}
