import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}

/** Pill search field used in the top bar. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Поиск",
  className,
}: SearchInputProps) {
  return (
    <label
      className={cn(
        "flex h-14 items-center gap-4 rounded-pill bg-surface-6 px-6",
        className,
      )}
    >
      <Search className="h-5 w-5 shrink-0 text-fg-tertiary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-md outline-none placeholder:text-fg-tertiary md:text-lg"
      />
    </label>
  );
}
