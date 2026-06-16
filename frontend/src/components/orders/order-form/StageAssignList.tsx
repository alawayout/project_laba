import { StageAssignRow } from "./StageAssignRow";
import type { OrderFormStage } from "@/lib/types";

interface StageAssignListProps {
  stages: OrderFormStage[];
  onAssign: (stageId: string, technicianId: string | null) => void;
}

/** Список этапов наряда с назначением техников. */
export function StageAssignList({ stages, onAssign }: StageAssignListProps) {
  return (
    <div className="my-1">
      {stages.map((stage) => (
        <StageAssignRow
          key={stage.id}
          stage={stage}
          onAssign={(technicianId) => onAssign(stage.id, technicianId)}
        />
      ))}
    </div>
  );
}
