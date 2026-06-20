import { WorkTypesContent } from "./WorkTypesContent";

/** Виды работ: серверная обвязка страницы + клиентский остров с фильтром. */
export function WorkTypesView() {
	return (
		<section style={{ animation: "labbor-view-in 0.32s ease" }}>
			<h1 className="mb-5 pt-2 text-3xl font-semibold md:text-4xl">
				Виды работ
			</h1>

			<WorkTypesContent />
		</section>
	);
}
