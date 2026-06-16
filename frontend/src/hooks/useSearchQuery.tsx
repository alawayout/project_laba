"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

interface SearchContextValue {
	query: string;
	setQuery: (value: string) => void;
	/** Открыта ли выпадающая выдача поиска. */
	open: boolean;
	setOpen: (value: boolean) => void;
	/** Очистить запрос и закрыть выдачу. */
	reset: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({
	children,
}: Readonly<{ children: ReactNode }>) {
	const [query, setQueryState] = useState("");
	const [open, setOpen] = useState(false);

	const setQuery = useCallback((value: string) => {
		setQueryState(value);
		setOpen(value.trim().length > 0);
	}, []);

	const reset = useCallback(() => {
		setQueryState("");
		setOpen(false);
	}, []);

	const value = useMemo<SearchContextValue>(
		() => ({ query, setQuery, open, setOpen, reset }),
		[query, open, setQuery, reset],
	);

	return (
		<SearchContext.Provider value={value}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearchQuery(): SearchContextValue {
	const ctx = useContext(SearchContext);
	if (!ctx)
		throw new Error("useSearchQuery must be used within <SearchProvider>");
	return ctx;
}
