"use client";

import { useMemo, useState } from "react";
import { workTypes } from "@/lib/mocks/work-types.mock";
import type { WorkType } from "@/lib/types";

const ALL = "all" as const;

interface UseWorkTypes {
  query: string;
  setQuery: (next: string) => void;
  category: string;
  setCategory: (next: string) => void;
  categories: string[];
  items: WorkType[];
}

/** Work-types catalogue: search + category filter. */
export function useWorkTypes(): UseWorkTypes {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(workTypes.map((w) => w.category)))],
    [],
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workTypes.filter((w) => {
      const matchesQuery = !q || w.name.toLowerCase().includes(q);
      const matchesCategory = category === ALL || w.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return { query, setQuery, category, setCategory, categories, items };
}
