"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useAuth } from "@/hooks/useAuth";
import { useLabs } from "@/hooks/useLabs";
import type { LabSummary } from "@/lib/api/labs";
import { LabRow } from "./LabRow";
import { CreateLabModal } from "./CreateLabModal";
import { EditLabModal } from "./EditLabModal";
import { BlockLabModal } from "./BlockLabModal";

const TABS = [
	{ id: "active", label: "Активные" },
	{ id: "blocked", label: "Заблокированные" },
] as const;

/**
 * Экран платформенного администратора — CRUD поверх Lab: создание,
 * переименование/смена тарифа, блокировка (мягкое удаление через
 * подписку CANCELED, без потери данных) и восстановление.
 */
export function LabsView() {
	const { session } = useAuth();
	const { loading, error, active, blocked, reload, rename, block, restore } = useLabs();

	const [tab, setTab] = useState<"active" | "blocked">("active");
	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<LabSummary | null>(null);
	const [blockTarget, setBlockTarget] = useState<LabSummary | null>(null);

	// Защитный минимум на случай гонки состояний, см. аналогичный комментарий в EmployeesView.
	if (!session) {
		return null;
	}

	if (!session.isSuperAdmin) {
		return (
			<div className="anim-view flex min-h-[60vh] max-w-[720px] flex-col items-center justify-center text-center">
				<p className="text-lg font-medium">Недостаточно прав</p>
				<p className="mx-auto mt-2 max-w-sm text-caption text-fg-secondary">
					Управление лабораториями доступно только платформенным администраторам.
				</p>
			</div>
		);
	}

	const list = tab === "active" ? active : blocked;

	return (
		<div className="anim-view max-w-[1180px]">
			<header className="my-3.5 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-3xl font-semibold">Лаборатории</h1>
				<Button leftIcon={<Plus className="h-5 w-5" />} onClick={() => setCreateOpen(true)}>
					Новая лаборатория
				</Button>
			</header>

			<SegmentedTabs
				options={TABS}
				value={tab}
				onChange={(id) => setTab(id as "active" | "blocked")}
			/>

			<div className="mt-5 flex flex-col gap-3.5">
				{loading && <p className="text-md text-fg-muted">Загрузка…</p>}
				{error && <p className="text-md text-dead-fg">{error}</p>}
				{!loading && !error && list.length === 0 && (
					<p className="text-md text-fg-muted">
						{tab === "active" ? "Лабораторий пока нет." : "Заблокированных лабораторий нет."}
					</p>
				)}
				{list.map((lab) => (
					<LabRow
						key={lab.id}
						lab={lab}
						onEdit={() => setEditTarget(lab)}
						onBlock={() => setBlockTarget(lab)}
						onRestore={() => void restore(lab.id)}
					/>
				))}
			</div>

			{createOpen && (
				<CreateLabModal onClose={() => setCreateOpen(false)} onCreated={() => void reload()} />
			)}

			{editTarget && (
				<EditLabModal
					lab={editTarget}
					onClose={() => setEditTarget(null)}
					onConfirm={(input) => rename(editTarget.id, input)}
				/>
			)}

			{blockTarget && (
				<BlockLabModal
					labName={blockTarget.name}
					onClose={() => setBlockTarget(null)}
					onConfirm={() => block(blockTarget.id)}
				/>
			)}
		</div>
	);
}
