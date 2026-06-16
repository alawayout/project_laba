"use client";

import { Search, X } from "lucide-react";

interface SearchFieldProps {
	value: string;
	onChange: (value: string) => void;
	onFocus?: () => void;
	onClear?: () => void;
}

/** Презентационная строка-пилюля поиска. Состояние — снаружи. */
export function SearchField({
	value,
	onChange,
	onFocus,
	onClear,
}: Readonly<SearchFieldProps>) {
	return (
		<div className="flex h-16 items-center gap-4 rounded-pill bg-surface-6 px-7">
			<Search className="size-5.5 shrink-0 text-[#d0d0d0]" />
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={onFocus}
				placeholder="Поиск"
				aria-label="Поиск по нарядам, техникам и врачам"
				className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-[#d0d0d0]"
			/>
			{value ? (
				<button
					type="button"
					aria-label="Очистить поиск"
					onClick={onClear}
					className="flex size-7 shrink-0 items-center justify-center rounded-pill text-fg-muted transition hover:bg-white/10 hover:text-fg [&_svg]:size-5"
				>
					<X />
				</button>
			) : null}
		</div>
	);
}
