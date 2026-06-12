"use client";

import { Avatar, Button, Field, Modal } from "@/components/ui";
import type { WorkStage } from "@/lib/types";

interface ReportModalProps {
  stage: WorkStage;
  workType: string;
  onClose: () => void;
}

/** Read-only completed-stage report. */
export function ReportModal({ stage, workType, onClose }: ReportModalProps) {
  const report = stage.report;
  return (
    <Modal title="Отчёт" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <Field tone="modal" label="Вид работы" value={workType} />

        <div className="flex items-center gap-3.5 px-1">
          <Avatar
            src={stage.technician.avatarUrl}
            alt={stage.technician.name}
            size={46}
          />
          <div>
            <div className="text-caption text-fg-muted">
              {stage.step} · {stage.name}
            </div>
            <div className="text-md">{stage.technician.name}</div>
          </div>
        </div>

        {report && (
          <>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field tone="modal" label="Взял в работу" value={report.takenAt} />
              <Field tone="modal" label="Завершил" value={report.completedAt} />
            </div>
            <p className="ml-1 text-caption text-fg-tertiary">
              Время исполнения: {report.duration}
            </p>
            <Field
              tone="modal"
              alignTop
              label="Комментарий"
              value={report.comment}
            />
          </>
        )}

        <Button variant="ghost" block onClick={onClose} className="mt-2">
          Закрыть
        </Button>
      </div>
    </Modal>
  );
}
