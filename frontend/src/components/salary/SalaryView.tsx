"use client";

import { AppShell } from "@/components/layout";
import { GlassCard } from "@/components/ui";
import { usePayroll } from "@/hooks";
import { formatRub } from "@/lib/utils";
import { CompletedChart } from "./CompletedChart";
import { EarningsSummary } from "./EarningsSummary";
import { PayrollList } from "./PayrollList";

/** Зарплаты: period earnings (glass income card) + admin payroll table. */
export function SalaryView() {
	const { period, rows, net, fund, pendingCount } = usePayroll();

	return (
		<AppShell>
			<section style={{ animation: "labbor-view-in 0.32s ease" }}>
				<h1 className="mb-6 pt-2 text-3xl font-semibold md:text-4xl">
					Зарплаты
				</h1>

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
					<GlassCard>
						<EarningsSummary period={period} net={net} />
					</GlassCard>
					<GlassCard>
						<CompletedChart
							buckets={period.completed}
							payout={period.payout}
							payoutDate={period.payoutDate}
						/>
					</GlassCard>
				</div>

				<div className="mt-7 flex flex-wrap items-end justify-between gap-3">
					<h2 className="text-2xl font-semibold">Техники</h2>
					<div className="text-md text-fg-muted">
						Фонд:{" "}
						<span className="font-semibold text-fg">
							{formatRub(fund)} ₽
						</span>
						<span className="mx-2">·</span>
						Ждут выплаты:{" "}
						<span className="font-semibold text-accent">
							{pendingCount}
						</span>
					</div>
				</div>
				<div className="mt-4">
					<PayrollList rows={rows} />
				</div>
			</section>
		</AppShell>
	);
}
