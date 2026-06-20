"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Avatar } from "@/components/ui";
import { technicians, getTechnicianById } from "@/lib/mocks/staff.mock";
import type { OrderFormStage } from "@/lib/types";

interface StageAssignRowProps {
	stage: OrderFormStage;
	onAssign: (technicianId: string | null) => void;
}

/** Строка этапа в форме: назначение/смена техника через выпадающий список. */
export function StageAssignRow({ stage, onAssign }: StageAssignRowProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const tech = stage.technicianId
		? getTechnicianById(stage.technicianId)
		: undefined;

	useEffect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		return () => document.removeEventListener("mousedown", onDown);
	}, [open]);

	return (
		<div className="border-b border-line py-4 last:border-b-0">
			<div className="flex items-center gap-3.5">
				<span className="text-lg text-fg-tertiary">{stage.step}</span>
				<span className="text-lg font-semibold">{stage.name}</span>
			</div>

			<div ref={ref} className="relative mt-3.5">
				{tech ? (
					<div className="flex items-center gap-3.5">
						<Avatar src={tech.avatarUrl} alt={tech.name} size={46} />
						<span className="min-w-0 truncate text-md">{tech.name}</span>
						<button
							type="button"
							onClick={() => onAssign(null)}
							aria-label="Убрать техника"
							className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-fg-muted transition hover:bg-surface-5 hover:text-fg [&_svg]:size-5"
						>
							<X />
						</button>
					</div>
				) : (
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						className="flex items-center gap-3.5 text-fg-muted transition hover:text-fg"
					>
						<span className="flex h-[46px] w-[46px] items-center justify-center rounded-pill border border-dashed border-[#5a5a5a] [&_svg]:size-5">
							<Plus />
						</span>
						Добавить техника
					</button>
				)}

				{open && !tech && (
					<ul className="absolute left-0 top-[calc(100%+6px)] z-10 w-full max-w-[360px] overflow-hidden rounded-2xl border border-line bg-[#262626] shadow-modal">
						{technicians.map((t) => (
							<li key={t.id}>
								<button
									type="button"
									onClick={() => {
										onAssign(t.id);
										setOpen(false);
									}}
									className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#333]"
								>
									<Avatar src={t.avatarUrl} alt={t.name} size={34} />
									<span className="text-md">{t.name}</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
