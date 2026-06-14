import { ClipboardList, Repeat, TriangleAlert } from "lucide-react";
import { Avatar, Badge, IconButton } from "@/components/ui";
import type { WorkStage } from "@/lib/types";

interface StageRowProps {
	stage: WorkStage;
	editing: boolean;
	onReport: (stage: WorkStage) => void;
	onReplace: (stage: WorkStage) => void;
	onFine: (stage: WorkStage) => void;
}

/** One production stage row with status, technician and actions. */
export function StageRow({
	stage,
	editing,
	onReport,
	onReplace,
	onFine,
}: StageRowProps) {
	return (
		<div className="border-b border-line py-4 last:border-b-0">
			<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
				<span className="text-lg text-fg-tertiary">{stage.step}</span>
				<span className="text-lg font-semibold">{stage.name}</span>
				<div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
					{stage.timeline && (
						<span className="rounded-pill bg-surface-4 px-3 py-1.5 text-micro text-fg-muted">
							{stage.timeline}
						</span>
					)}
					{stage.deadlineNote && (
						<span className="rounded-pill bg-[#3a2424] px-3 py-1.5 text-micro text-dead-fg">
							{stage.deadlineNote}
						</span>
					)}
					<Badge status={stage.status} size="sm" />
				</div>
			</div>

			<div className="mt-3.5 flex items-center gap-3.5">
				<Avatar
					src={stage.technician.avatarUrl}
					alt={stage.technician.name}
					size={46}
				/>
				<span className="min-w-0 truncate text-md">
					{stage.technician.name}
				</span>
				<div className="ml-auto flex shrink-0 gap-2.5">
					{stage.status === "clinic" && (
						<IconButton
							tone="lime"
							label="Отчёт"
							onClick={() => onReport(stage)}
						>
							<ClipboardList />
						</IconButton>
					)}
					{editing && (
						<>
							<IconButton
								tone="warn"
								label="Выписать штраф"
								onClick={() => onFine(stage)}
							>
								<TriangleAlert />
							</IconButton>
							<IconButton
								tone="lime"
								label="Замена техника"
								onClick={() => onReplace(stage)}
							>
								<Repeat />
							</IconButton>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
