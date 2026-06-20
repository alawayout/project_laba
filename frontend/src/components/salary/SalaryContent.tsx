"use client";

import { GlassCard } from "@/components/ui";
import { usePayroll } from "@/hooks";
import { formatRub } from "@/lib/utils";
import { CompletedChart } from "./CompletedChart";
import { EarningsSummary } from "./EarningsSummary";
import { PayrollList } from "./PayrollList";

/** Данные зарплат: period earnings (glass income card) + admin payroll table. */
export function SalaryContent() {
	const { period, rows, net, fund, pendingCount } = usePayroll();

	return (
		<>
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
		</>
	);
}
