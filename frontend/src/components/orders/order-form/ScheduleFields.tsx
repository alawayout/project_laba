"use client";

import { Calendar, X } from "lucide-react";
import { TextField, DashedButton } from "@/components/ui";
import type { DateTimeValue, OrderFormFitting } from "@/lib/types";

interface ScheduleFieldsProps {
  due: DateTimeValue;
  onDue: (patch: Partial<DateTimeValue>) => void;
  fittings: OrderFormFitting[];
  onAddFitting: () => void;
  onRemoveFitting: (id: string) => void;
  onSetFitting: (id: string, patch: Partial<OrderFormFitting>) => void;
}

const calendarIcon = <Calendar className="h-5 w-5 shrink-0 text-fg-muted" />;

/** Сроки: дата сдачи, время и примерки с добавлением/удалением. */
export function ScheduleFields({
  due,
  onDue,
  fittings,
  onAddFitting,
  onRemoveFitting,
  onSetFitting,
}: ScheduleFieldsProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-[1fr_auto] gap-3.5">
        <TextField
          label="Дата сдачи"
          value={due.date}
          onChange={(date) => onDue({ date })}
          placeholder="01.01.2025"
          trailing={calendarIcon}
        />
        <TextField
          label="Время"
          value={due.time}
          onChange={(time) => onDue({ time })}
          placeholder="10:00"
          className="w-[116px]"
        />
      </div>

      {fittings.map((fitting, i) => (
        <div key={fitting.id} className="grid grid-cols-[1fr_auto_auto] gap-3.5">
          <TextField
            label={`Примерка ${i + 1}`}
            value={fitting.date}
            onChange={(date) => onSetFitting(fitting.id, { date })}
            placeholder="01.01.2025"
            trailing={calendarIcon}
          />
          <TextField
            label="Время"
            value={fitting.time}
            onChange={(time) => onSetFitting(fitting.id, { time })}
            placeholder="10:00"
            className="w-[116px]"
          />
          <button
            type="button"
            onClick={() => onRemoveFitting(fitting.id)}
            aria-label={`Убрать примерку ${i + 1}`}
            className="flex w-11 items-center justify-center rounded-field bg-[#262626] text-fg-muted transition hover:text-fg [&_svg]:size-5"
          >
            <X />
          </button>
        </div>
      ))}

      <DashedButton block onClick={onAddFitting}>
        Добавить примерку
      </DashedButton>
    </div>
  );
}
