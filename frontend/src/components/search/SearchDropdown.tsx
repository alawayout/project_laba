"use client";

import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { SearchSection } from "./SearchSection";
import { SearchEmpty } from "./SearchEmpty";
import { OrderResult } from "./results/OrderResult";
import { PersonResult } from "./results/PersonResult";

interface SearchDropdownProps {
	/** Закрыть выдачу и очистить запрос при переходе. */
	onNavigate: () => void;
}

/** Liquid-glass выдача мульти-поиска, сгруппированная по сущностям. */
export function SearchDropdown({ onNavigate }: Readonly<SearchDropdownProps>) {
	const { query, hasQuery, orders, techs, doctors, total } =
		useGlobalSearch();

	if (!hasQuery) return null;

	return (
		<div
			role="listbox"
			className="glass-nav anim-drop absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[70vh] divide-y divide-line/70 overflow-y-auto rounded-[26px] p-2.5 shadow-modal ring-1 ring-white/6"
			style={{
				WebkitBackdropFilter: "blur(28px) saturate(1.4)",
				backdropFilter: "blur(28px) saturate(1.4)",
				backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 18%, transparent 60%)",
			}}
		>
			{total === 0 ? (
				<SearchEmpty />
			) : (
				<>
					<SearchSection
						title="Наряды"
						items={orders}
						getKey={(o) => o.id}
						renderItem={(o) => (
							<OrderResult
								order={o}
								query={query}
								onNavigate={onNavigate}
							/>
						)}
					/>
					<SearchSection
						title="Техники"
						items={techs}
						getKey={(t) => t.id}
						renderItem={(t) => (
							<PersonResult
								href={`/techs/${t.id}`}
								avatar={t.avatar}
								name={t.name}
								subtitle={t.category}
								query={query}
								onNavigate={onNavigate}
							/>
						)}
					/>
					<SearchSection
						title="Врачи"
						items={doctors}
						getKey={(d) => d.id}
						renderItem={(d) => (
							<PersonResult
								href={`/doctors/${d.id}`}
								avatar={d.avatar}
								name={d.name}
								subtitle={d.clinic}
								query={query}
								onNavigate={onNavigate}
							/>
						)}
					/>
				</>
			)}
		</div>
	);
}
