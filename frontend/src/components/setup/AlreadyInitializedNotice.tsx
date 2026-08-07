import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Показывается на /setup, если суперадмин уже создан — повторный бутстрап закрыт. */
export function AlreadyInitializedNotice() {
	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-pill bg-surface-5 text-fg-secondary">
				<Lock className="size-6" />
			</span>
			<p className="text-lg font-medium">Система уже инициализирована</p>
			<p className="text-caption text-fg-secondary">
				Платформенный администратор уже создан. Повторное создание недоступно из
				соображений безопасности.
			</p>
			<Link href="/" className="w-full">
				<Button block variant="ghost">
					На главную
				</Button>
			</Link>
		</div>
	);
}
