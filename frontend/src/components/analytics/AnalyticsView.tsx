import { AnalyticsContent } from "./AnalyticsContent";

/** Аналитика: серверная обвязка страницы + клиентский остров с графиками. */
export function AnalyticsView() {
	return (
		<section
			style={{ animation: "labbor-view-in 0.32s ease" }}
			className="mx-auto max-w-[1280px]"
		>
			<h1 className="mb-6 pt-2 text-3xl font-semibold md:text-4xl">
				Аналитика
			</h1>

			<AnalyticsContent />
		</section>
	);
}
