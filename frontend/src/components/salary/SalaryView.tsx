import { SalaryContent } from "./SalaryContent";

/** Зарплаты: серверная обвязка страницы + клиентский остров с данными. */
export function SalaryView() {
	return (
		<section style={{ animation: "labbor-view-in 0.32s ease" }}>
			<h1 className="mb-6 pt-2 text-3xl font-semibold md:text-4xl">
				Зарплаты
			</h1>

			<SalaryContent />
		</section>
	);
}
