"use client";

import { useEffect, useRef } from "react";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { SearchField } from "./SearchField";
import { SearchDropdown } from "./SearchDropdown";

/** Глобальный мульти-поиск в шапке: поле + выпадающая выдача. */
export function GlobalSearch() {
	const { query, setQuery, open, setOpen, reset } = useSearchQuery();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open, setOpen]);

	return (
		<div ref={ref} className="relative min-w-0 flex-1">
			<SearchField
				value={query}
				onChange={setQuery}
				onFocus={() => {
					if (query.trim()) setOpen(true);
				}}
				onClear={reset}
			/>
			{open ? <SearchDropdown onNavigate={reset} /> : null}
		</div>
	);
}
