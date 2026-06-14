"use client";

import { AppShell } from "@/components/layout";
import { useWorkTypes } from "@/hooks";
import { CategoryFilter } from "./CategoryFilter";
import { WorkTypeList } from "./WorkTypeList";

/** Виды работ: searchable + category-filtered catalogue. */
export function WorkTypesView() {
  const { query, setQuery, category, setCategory, categories, items } =
    useWorkTypes();

  return (
    <AppShell search={{ value: query, onChange: setQuery }}>
      <section
        style={{ animation: "labbor-view-in 0.32s ease" }}
        className="mx-auto max-w-[1100px]"
      >
        <h1 className="mb-5 pt-2 text-3xl font-semibold md:text-4xl">
          Виды работ
        </h1>

        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        <WorkTypeList items={items} />
      </section>
    </AppShell>
  );
}
