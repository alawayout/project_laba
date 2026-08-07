import { getSetupStatus } from "@/lib/api/setup";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SetupForm } from "@/components/setup/SetupForm";
import { AlreadyInitializedNotice } from "@/components/setup/AlreadyInitializedNotice";
import { SetupUnavailableNotice } from "@/components/setup/SetupUnavailableNotice";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
	try {
		const { initialized } = await getSetupStatus();

		return (
			<AuthLayout
				title="Настройка платформы"
				subtitle={
					initialized
						? undefined
						: "Это первый запуск — создайте аккаунт платформенного администратора."
				}
			>
				{initialized ? <AlreadyInitializedNotice /> : <SetupForm />}
			</AuthLayout>
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Неизвестная ошибка";
		return (
			<AuthLayout title="Настройка платформы">
				<SetupUnavailableNotice message={message} />
			</AuthLayout>
		);
	}
}
