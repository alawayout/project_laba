import { Calendar } from "lucide-react";

/** Пилюля текущей даты в шапке. */
export function DatePill({ label }: { label: string }) {
	return (
		<div className="flex h-16 shrink-0 items-center gap-3.5 rounded-pill border-2 border-fg py-0 pl-5.5 pr-2">
			<span className="whitespace-nowrap text-lg font-medium">
				{label}
			</span>
			<span className="flex size-[50px] items-center justify-center rounded-pill bg-[#d9d9d9] text-black">
				<Calendar className="size-6.5" />
			</span>
		</div>
	);
}
