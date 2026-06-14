import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
	title: string;
	/** Колбэк для круглой «+» кнопки рядом с заголовком. */
	onAdd?: () => void;
	/** Контролы в правой части шапки (например, переключатель). */
	headerRight?: ReactNode;
	className?: string;
	children: ReactNode;
}

/** Тёмная панель-секция с заголовком, «+» и слотом контролов справа. */
export function Panel({
	title,
	onAdd,
	headerRight,
	className,
	children,
}: PanelProps) {
	return (
		<section
			className={cn("rounded-panel bg-surface-1 p-6 md:p-7", className)}
		>
			<header className="mb-5 flex items-center justify-between gap-3">
				<div className="flex items-center gap-3.5">
					<h2 className="text-2xl font-semibold md:text-3xl">
						{title}
					</h2>
					{onAdd ? (
						<button
							type="button"
							onClick={onAdd}
							aria-label={`Добавить: ${title}`}
							className="flex size-9 items-center justify-center rounded-pill border border-fg-secondary text-fg-secondary transition hover:bg-surface-5 hover:text-fg [&_svg]:size-5"
						>
							<Plus />
						</button>
					) : null}
				</div>
				{headerRight}
			</header>
			{children}
		</section>
	);
}
