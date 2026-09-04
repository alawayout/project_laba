"use client";

import { useState, type ReactNode } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useAuth } from "@/hooks/useAuth";
import { useEmployees } from "@/hooks/useEmployees";
import { useInvitesList } from "@/hooks/useInvitesList";
import { canManageEmployee } from "@/lib/permissions";
import type { Employee } from "@/lib/api/employees";
import { EmployeeRow } from "./EmployeeRow";
import { InviteRow } from "./InviteRow";
import { InviteEmployeeModal } from "./InviteEmployeeModal";
import { RemoveEmployeeModal } from "./RemoveEmployeeModal";
import { EmployeeHistoryModal } from "./EmployeeHistoryModal";

const TABS = [
	{ id: "active", label: "Активные" },
	{ id: "archived", label: "Архив" },
	{ id: "invites", label: "Приглашения" },
] as const;

/** Экран управления сотрудниками лабы — CRUD поверх LabMembership. */
export function EmployeesView() {
	// Сама авторизация (вход/редирект на /login) проверяется на уровне
	// базового маршрута — см. RequireAuth в (dashboard)/layout.tsx. Сюда
	// компонент попадает уже гарантированно авторизованным; session здесь
	// нужен только чтобы прочитать labId/role текущего пользователя.
	const { session, profile } = useAuth();
	const labId = session?.labId;
	const { loading, error, active, archived, changeRole, toggleBlocked, remove, restore } =
		useEmployees(labId);
	const {
		invites,
		loading: invitesLoading,
		error: invitesError,
		reload: reloadInvites,
		revoke: revokeInvite,
	} = useInvitesList(labId);

	const [tab, setTab] = useState<"active" | "archived" | "invites">("active");
	const [inviteOpen, setInviteOpen] = useState(false);
	const [removeTarget, setRemoveTarget] = useState<Employee | null>(null);
	const [historyTarget, setHistoryTarget] = useState<Employee | null>(null);

	// Защитный минимум на случай гонки состояний (например, сессия истекла
	// прямо во время рендера, до того как RequireAuth успел отреагировать
	// и увести на /login) — реальный пользователь этого не увидит.
	if (!session) {
		return null;
	}

	// Вход прошёл, но у аккаунта нет активного членства ни в одной лабе —
	// например, это платформенный админ (isSuperAdmin) без своей лабы.
	// Такому аккаунту нечем управлять: employees всегда в контексте конкретной labId.
	if (!labId) {
		return (
			<CenteredMessage>
				<p className="text-lg font-medium">Нет доступа к рабочему кабинету лабы</p>
				<p className="mx-auto mt-2 max-w-sm text-caption text-fg-secondary">
					{session.isSuperAdmin
						? "Вы вошли как платформенный администратор — у такого аккаунта нет своей лаборатории. Создайте лабу и владельца через Swagger (/docs → POST /api/labs), затем войдите под аккаунтом владельца."
						: "У этого аккаунта нет активного членства ни в одной лаборатории. Обратитесь к владельцу лабы за приглашением."}
				</p>
			</CenteredMessage>
		);
	}

	if (session.role === "TECHNICIAN") {
		return (
			<CenteredMessage>
				<p className="text-lg font-medium">Недостаточно прав</p>
				<p className="mx-auto mt-2 max-w-sm text-caption text-fg-secondary">
					Управлять сотрудниками могут только владелец и администраторы лаборатории.
				</p>
			</CenteredMessage>
		);
	}

	const list = tab === "active" ? active : tab === "archived" ? archived : [];
	const employeeName = (e: Employee) => `${e.firstName} ${e.lastName}`.trim() || e.email;

	return (
		<div className="anim-view max-w-[1180px]">
			<header className="my-3.5 flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-semibold">Сотрудники</h1>
					{profile && <p className="mt-1 text-caption text-fg-muted">{profile.email}</p>}
				</div>
				<div className="flex items-center gap-3">
					<Button leftIcon={<UserPlus className="h-5 w-5" />} onClick={() => setInviteOpen(true)}>
						Пригласить
					</Button>
				</div>
			</header>

			<SegmentedTabs options={TABS} value={tab} onChange={(id) => setTab(id as "active" | "archived" | "invites")} />

			<div className="mt-5 flex flex-col gap-3.5">
				{tab !== "invites" && (
					<>
						{loading && <p className="text-md text-fg-muted">Загрузка…</p>}
						{error && <p className="text-md text-dead-fg">{error}</p>}
						{!loading && !error && list.length === 0 && (
							<p className="text-md text-fg-muted">
								{tab === "active" ? "Сотрудников пока нет." : "Архив пуст."}
							</p>
						)}
						{list.map((employee) => (
							<EmployeeRow
								key={employee.userId}
								employee={employee}
								actorRole={session.role}
								currentUserId={session.sub}
								onChangeRole={(role) => void changeRole(employee.userId, role)}
								onToggleBlocked={(blocked) => void toggleBlocked(employee.userId, blocked)}
								onRemove={() => setRemoveTarget(employee)}
								onRestore={() => void restore(employee.userId)}
								onShowHistory={() => setHistoryTarget(employee)}
							/>
						))}
					</>
				)}

				{tab === "invites" && (
					<>
						{invitesLoading && <p className="text-md text-fg-muted">Загрузка…</p>}
						{invitesError && <p className="text-md text-dead-fg">{invitesError}</p>}
						{!invitesLoading && !invitesError && invites.length === 0 && (
							<p className="text-md text-fg-muted">Приглашений пока нет.</p>
						)}
						{invites.map((invite) => (
							<InviteRow
								key={invite.id}
								invite={invite}
								canManage={canManageEmployee(session.role, invite.role)}
								onRevoke={() => void revokeInvite(invite.id)}
							/>
						))}
					</>
				)}
			</div>

			{inviteOpen && (
				<InviteEmployeeModal
					labId={labId}
					onClose={() => setInviteOpen(false)}
					onInvited={() => {
						void reloadInvites();
						setTab("invites");
					}}
				/>
			)}

			{removeTarget && (
				<RemoveEmployeeModal
					employeeName={employeeName(removeTarget)}
					onClose={() => setRemoveTarget(null)}
					onConfirm={(reason) => remove(removeTarget.userId, reason)}
				/>
			)}

			{historyTarget && (
				<EmployeeHistoryModal
					labId={labId}
					userId={historyTarget.userId}
					employeeName={employeeName(historyTarget)}
					onClose={() => setHistoryTarget(null)}
				/>
			)}
		</div>
	);
}

function CenteredMessage({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className="anim-view flex min-h-[60vh] max-w-[720px] flex-col items-center justify-center text-center">
			{children}
		</div>
	);
}
