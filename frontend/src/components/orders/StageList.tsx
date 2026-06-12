import type { WorkStage } from "@/lib/types";
import { StageRow } from "./StageRow";

interface StageListProps {
  stages: WorkStage[];
  editing: boolean;
  onReport: (stage: WorkStage) => void;
  onReplace: (stage: WorkStage) => void;
  onFine: (stage: WorkStage) => void;
}

/** List of production stages for an order. */
export function StageList(props: StageListProps) {
  const { stages, ...handlers } = props;
  return (
    <div>
      {stages.map((stage) => (
        <StageRow key={stage.id} stage={stage} {...handlers} />
      ))}
    </div>
  );
}
