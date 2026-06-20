import { DOCTORS } from "@/lib/mocks/doctors";
import { workTypes } from "@/lib/mocks/work-types.mock";
import type {
	OrderDetail,
	OrderFormFitting,
	OrderFormPhoto,
	OrderFormStage,
	OrderFormValues,
	ToothArch,
} from "@/lib/types";

let seq = 0;
/** Локальный генератор id для элементов формы (клиентская сессия). */
const uid = (prefix: string): string =>
	`${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

/** Наборы зубов для быстрого выбора челюсти. */
export const ARCH_TEETH: Record<ToothArch, number[]> = {
	all: Array.from({ length: 32 }, (_, i) => i + 1),
	upper: Array.from({ length: 16 }, (_, i) => i + 1),
	lower: Array.from({ length: 16 }, (_, i) => i + 17),
};

const getWorkType = (id: string) => workTypes.find((w) => w.id === id);

/** Этапы по шаблону выбранного вида работы (техники не назначены). */
export function buildStages(workTypeId: string): OrderFormStage[] {
	const work = getWorkType(workTypeId);
	if (!work) return [];
	return work.stages.map((stage, i) => ({
		id: uid("stage"),
		step: `${i + 1} этап`,
		name: stage.name,
		technicianId: null,
	}));
}

export const newFitting = (): OrderFormFitting => ({
	id: uid("fit"),
	date: "",
	time: "",
});

export const photoFromUrl = (src: string): OrderFormPhoto => ({
	id: uid("photo"),
	src,
});

/** Пустая форма для создания наряда. */
export function createEmptyOrderForm(): OrderFormValues {
	const workTypeId = workTypes[0].id;
	return {
		number: "",
		doctorId: DOCTORS[0].id,
		patient: "",
		workTypeId,
		color: "",
		teeth: [],
		stages: buildStages(workTypeId),
		due: { date: "", time: "" },
		fittings: [newFitting()],
		priority: false,
		comment: "",
		photos: [],
	};
}

/** Преобразование подробной карточки наряда в значения формы (для edit). */
export function orderDetailToForm(detail: OrderDetail): OrderFormValues {
	const doctor = DOCTORS.find((d) => d.name === detail.doctor);
	const work = workTypes.find((w) => w.name === detail.workType);

	return {
		number: detail.number,
		doctorId: doctor?.id ?? DOCTORS[0].id,
		patient: detail.patient,
		workTypeId: work?.id ?? workTypes[0].id,
		color: detail.color,
		teeth: [...detail.selectedTeeth],
		stages: detail.stages.map((s, i) => ({
			id: s.id,
			step: s.step || `${i + 1} этап`,
			name: s.name,
			technicianId: s.technician?.id ?? null,
		})),
		due: { ...detail.due },
		fittings: detail.fittings.length
			? detail.fittings.map((f) => ({ id: uid("fit"), date: f.date, time: f.time }))
			: [newFitting()],
		priority: detail.priority,
		comment: detail.comment,
		photos: detail.photos.map((src) => ({ id: uid("photo"), src })),
	};
}
