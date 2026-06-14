import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayTask, TaskColor } from "@/lib/types/task";

const PILL_COLOR: Record<TaskColor, string> = {
	lime: "bg-accent text-black",
	blue: "bg-[#2f9be6] text-white",
	purple: "bg-[#7b3ff2] text-white",
};

interface TaskRowProps {
	task: DayTask;
	onToggle: (id: string) => void;
}

/** Строка таймлайна: время · узел · цветная пилюля задачи. */
export function TaskRow({ task, onToggle }: TaskRowProps) {
	return (
		<button
			type="button"
			onClick={() => onToggle(task.id)}
			className="flex w-full items-center gap-4 py-3 text-left"
		>
			<span className="w-14 shrink-0 text-md text-fg-muted">
				{task.time}
			</span>

			<span className="relative flex w-6 shrink-0 items-center justify-center self-stretch">
				<span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/15" />
				<span
					className={cn(
						"relative z-10 flex size-5 items-center justify-center rounded-full border-2 transition",
						task.done
							? "border-accent bg-accent text-black"
							: task.upcoming
								? "border-[#555] bg-bg"
								: "border-accent bg-bg",
					)}
				>
					{task.done ? (
						<Check className="size-3" strokeWidth={3} />
					) : null}
				</span>
			</span>

			<span
				className={cn(
					"inline-block rounded-pill px-5 py-3 text-base font-medium",
					PILL_COLOR[task.color],
				)}
			>
				{task.label}
			</span>
		</button>
	);
}
