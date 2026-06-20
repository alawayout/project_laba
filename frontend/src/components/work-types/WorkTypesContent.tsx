"use client";

import { useWorkTypes } from "@/hooks";
import { CategoryFilter } from "./CategoryFilter";
import { WorkTypeList } from "./WorkTypeList";

/** Интерактивная часть каталога: фильтр по категории + список (search + state). */
export function WorkTypesContent() {
	const { category, setCategory, categories, items } = useWorkTypes();

	return (
		<>
			<div className="mb-6">
				<CategoryFilter
					categories={categories}
					value={category}
					onChange={setCategory}
				/>
			</div>

			<WorkTypeList items={items} />
		</>
	);
}
