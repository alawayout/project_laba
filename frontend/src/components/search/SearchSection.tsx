"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSectionProps<T> {
	title: string;
	items: T[];
	getKey: (item: T) => string;
	renderItem: (item: T) => ReactNode;
	/** Сколько результатов показывать в свёрнутом состоянии. */
	preview?: number;
}

/** Секция выдачи (одна сущность) с раскрытием «Показать все». */
export function SearchSection<T>({
	title,
	items,
	getKey,
	renderItem,
	preview = 4,
}: Readonly<SearchSectionProps<T>>) {
	const [expanded, setExpanded] = useState(false);

	if (items.length === 0) return null;

	const shown = expanded ? items : items.slice(0, preview);
	const hasMore = items.length > preview;

	return (
		<section className="px-1.5 py-3">
			<h3 className="mb-2 px-2.5 text-2xl font-semibold">{title}</h3>
			<ul className="flex flex-col gap-1">
				{shown.map((item) => (
					<li key={getKey(item)}>{renderItem(item)}</li>
				))}
			</ul>
			{hasMore ? (
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="mx-auto mt-2 flex items-center gap-1.5 rounded-pill px-4 py-2 text-md font-medium text-accent transition hover:bg-white/[0.06]"
				>
					{expanded ? "Свернуть" : "Показать все"}
					<ChevronDown
						className={cn(
							"size-4 transition",
							expanded && "rotate-180",
						)}
					/>
				</button>
			) : null}
		</section>
	);
}
