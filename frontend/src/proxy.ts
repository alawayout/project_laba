import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSetupStatus } from "@/lib/api/setup";

/**
 * Гейт первого запуска: пока в системе нет ни одного платформенного
 * администратора, любой заход в дашборд редиректит на /setup.
 * После успешной инициализации ставим cookie, чтобы не дёргать бэкенд
 * на каждую навигацию (создание суперадмина необратимо — достаточно проверить один раз).
 *
 * В Next.js 16 файловая конвенция `middleware.ts` переименована в `proxy.ts`
 * (см. https://nextjs.org/docs/messages/middleware-to-proxy) — старое имя
 * ещё работает, но помечено deprecated.
 */

const SETUP_OK_COOKIE = "labbor_setup_ok";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function proxy(request: NextRequest) {
	if (request.cookies.get(SETUP_OK_COOKIE)?.value === "1") {
		return NextResponse.next();
	}

	try {
		const { initialized } = await getSetupStatus();
		if (!initialized) {
			return NextResponse.redirect(new URL("/setup", request.url));
		}
	} catch {
		// Бэкенд недоступен — не блокируем навигацию, страницы сами покажут ошибку при обращении к API.
		return NextResponse.next();
	}

	const response = NextResponse.next();
	response.cookies.set(SETUP_OK_COOKIE, "1", {
		maxAge: COOKIE_MAX_AGE_SECONDS,
		path: "/",
	});
	return response;
}

export const config = {
	matcher: ["/((?!setup|invites|_next/static|_next/image|favicon.ico).*)"],
};
