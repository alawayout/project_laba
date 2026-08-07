interface ApiErrorBody {
	message?: string | string[];
	error?: string;
	statusCode?: number;
}

/** Ошибка запроса к API с человекочитаемым сообщением из ответа NestJS. */
export class ApiRequestError extends Error {
	constructor(
		public readonly statusCode: number,
		message: string,
	) {
		super(message);
		this.name = "ApiRequestError";
	}
}

/** Тонкая обёртка над fetch: JSON in/out + понятная ошибка на не-2xx. */
export async function apiFetch<T>(
	baseUrl: string,
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${baseUrl}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
		cache: "no-store",
	});

	if (!res.ok) {
		let message = `Ошибка запроса (${res.status})`;
		try {
			const body = (await res.json()) as ApiErrorBody;
			if (Array.isArray(body.message)) message = body.message.join(", ");
			else if (body.message) message = body.message;
		} catch {
			// тело не JSON — оставляем дефолтное сообщение
		}
		throw new ApiRequestError(res.status, message);
	}

	if (res.status === HTTP_NO_CONTENT) return undefined as T;
	return (await res.json()) as T;
}

const HTTP_NO_CONTENT = 204;
