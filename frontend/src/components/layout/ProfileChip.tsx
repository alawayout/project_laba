"use client";

import { LogOut } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ProfileChipProps {
	/** Имя пользователя (или email, если имя ещё не подгружено). */
	name: string;
	/** Локализованная роль, напр. "Администратор" или "Владелец". */
	roleLabel: string;
	avatarUrl?: string | null;
}

/**
 * Signed-in user chip. Наведение (и фокус — для клавиатуры) раскрывает
 * выпадающий список с выходом из аккаунта: единая точка выхода на все
 * страницы приложения вместо отдельных кнопок «Выйти» на каждой странице.
 *
 * Зазор между кнопкой и панелью сделан паддингом (`pt-2`), а не margin'ом:
 * margin оставляет пиксели между двумя боксами, ничему не принадлежащие, и
 * курсор на пути от аватара к пункту меню на мгновение оказывается вне
 * `.group` — hover сбрасывается, и меню закрывается раньше, чем успеваешь
 * кликнуть «Выйти». Паддинг остаётся частью бокса-обёртки, поэтому наведение
 * непрерывно; сама обёртка `pointer-events-none` в закрытом состоянии, чтобы
 * не перехватывать клики по контенту под ней, пока меню не раскрыто.
 */
export function ProfileChip({ name, roleLabel, avatarUrl = null }: Readonly<ProfileChipProps>) {
	const { signOut } = useAuth();

	return (
		<div className="group relative">
			<button
				type="button"
				className="flex items-center gap-3.5 rounded-pill p-1 transition hover:bg-surface-4 md:pr-3.5"
			>
				<Avatar src={avatarUrl} alt={name} size={56} />
				<div className="hidden text-left md:block">
					<div className="text-md">{name}</div>
					<div className="text-sm text-fg-secondary">{roleLabel}</div>
				</div>
			</button>

			<div
				className={cn(
					"absolute right-0 top-full z-50 w-56 pt-2",
					"pointer-events-none",
					"group-hover:pointer-events-auto group-focus-within:pointer-events-auto",
				)}
			>
				<div
					className={cn(
						"origin-top-right rounded-field border border-line bg-surface-3 p-1.5 shadow-modal",
						"opacity-0 scale-95 transition-all duration-150",
						"group-hover:opacity-100 group-hover:scale-100",
						"group-focus-within:opacity-100 group-focus-within:scale-100",
					)}
				>
					<div className="px-3 py-2 md:hidden">
						<div className="text-md">{name}</div>
						<div className="text-sm text-fg-secondary">{roleLabel}</div>
					</div>
					<button
						type="button"
						onClick={() => void signOut()}
						className="flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-md text-dead-fg transition hover:bg-dead"
					>
						<LogOut className="h-5 w-5" />
						Выйти
					</button>
				</div>
			</div>
		</div>
	);
}
