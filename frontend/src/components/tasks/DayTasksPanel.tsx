"use client";

import { Panel } from "@/components/ui/Panel";
import { useDayTasks } from "@/hooks/useDayTasks";
import { useToaster } from "@/hooks/useToaster";
import { TaskRow } from "./TaskRow";

/** Панель «Задачи на день» — таймлайн с переключаемыми задачами. */
export function DayTasksPanel() {
	const { tasks, toggle } = useDayTasks();
	const { notify } = useToaster();

	return (
		<Panel
			title="Задачи на день"
			onAdd={() => notify("Добавление задачи — в следующей итерации")}
		>
			<div className="rounded-card bg-surface-3 p-5 md:p-6">
				<div className="flex flex-col">
					{tasks.map((task) => (
						<TaskRow key={task.id} task={task} onToggle={toggle} />
					))}
				</div>
			</div>
		</Panel>
	);
}
