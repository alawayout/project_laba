import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Автономный сервер в .next/standalone — для лёгкого docker-образа
	// (не тянет весь node_modules и монорепозиторий в рантайм).
	output: "standalone",
	// Явно фиксируем корень трейсинга на frontend/, а не на монорепозиторий
	// уровнем выше (у пакета свой package-lock.json — Next иначе может
	// найти его и разложить standalone-вывод по неожиданному пути).
	outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
