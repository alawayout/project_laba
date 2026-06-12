"use client";

import { useState } from "react";
import { AmountInput, Button, Field, Modal } from "@/components/ui";
import type { WorkStage } from "@/lib/types";

interface FineModalProps {
  stage: WorkStage;
  orderNumber: string;
  workType: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

/** Issue a fine to the stage technician. */
export function FineModal({
  stage,
  orderNumber,
  workType,
  onClose,
  onConfirm,
}: FineModalProps) {
  const [amount, setAmount] = useState("5000");
  const reason = `Отказ от работы: ${workType}. ${stage.step} — ${stage.name}. Наряд №${orderNumber}`;

  return (
    <Modal title="Новый штраф" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <Field tone="modal" label="Техник" value={stage.technician.name} locked />
        <Field tone="modal" alignTop label="Причина" value={reason} locked />
        <AmountInput value={amount} onChange={setAmount} />
        <Button block onClick={() => onConfirm(Number(amount || 0))} className="mt-2">
          Выписать штраф
        </Button>
      </div>
    </Modal>
  );
}
