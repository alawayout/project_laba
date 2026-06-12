"use client";

import { useState } from "react";
import { Button, Field, Modal, Select, type SelectOption } from "@/components/ui";
import { technicians } from "@/lib/mocks/staff.mock";
import type { Technician, WorkStage } from "@/lib/types";

interface ReplaceTechModalProps {
  stage: WorkStage;
  workType: string;
  onClose: () => void;
  onConfirm: (technician: Technician) => void;
}

/** Pick a different technician for a stage. */
export function ReplaceTechModal({
  stage,
  workType,
  onClose,
  onConfirm,
}: ReplaceTechModalProps) {
  const options: SelectOption[] = technicians
    .filter((t) => t.id !== stage.technician.id)
    .map((t) => ({ id: t.id, label: t.name }));
  const [nextId, setNextId] = useState(options[0]?.id ?? "");

  const handleConfirm = () => {
    const next = technicians.find((t) => t.id === nextId);
    if (next) onConfirm(next);
  };

  return (
    <Modal title="Замена техника" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div className="px-1">
          <div className="text-md font-medium">{workType}</div>
          <div className="text-caption text-fg-tertiary">
            {stage.step} · {stage.name}
          </div>
        </div>
        <Field
          tone="modal"
          label="Текущий техник"
          value={stage.technician.name}
          locked
        />
        <Select
          label="Новый техник"
          value={nextId}
          options={options}
          onChange={setNextId}
        />
        <Button block onClick={handleConfirm} className="mt-2">
          Заменить
        </Button>
      </div>
    </Modal>
  );
}
