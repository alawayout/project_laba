/**
 * Базовый URL API, доступный из браузера (клиентские компоненты, формы).
 * Должен резолвиться с машины пользователя — в докере это обычно
 * `http://localhost:3000/api`, наружу пробрасывается порт бэкенда.
 */
export const PUBLIC_API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

/**
 * Базовый URL API для серверного кода Next.js (middleware, RSC) —
 * внутри docker-compose это адрес сервиса `backend` по имени контейнера.
 * Наружу утекать не должен, поэтому НЕ NEXT_PUBLIC_*.
 */
export const SERVER_API_URL = process.env.BACKEND_INTERNAL_URL ?? PUBLIC_API_URL;
