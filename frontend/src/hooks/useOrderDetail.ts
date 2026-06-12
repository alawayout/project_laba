"use client";

import { useCallback, useState } from "react";
import { getOrderDetailById } from "@/lib/mocks/order-detail.mock";
import type { OrderDetail, Technician, WorkStage } from "@/lib/types";
import { useToothSelection } from "./useToothSelection";

interface UseOrderDetail {
  order: OrderDetail | undefined;
  selectedTeeth: number[];
  isToothSelected: (tooth: number) => boolean;
  toggleTooth: (tooth: number) => void;
  teethLabel: string;
  priority: boolean;
  setPriority: (next: boolean) => void;
  editing: boolean;
  toggleEditing: () => void;
  stages: WorkStage[];
  replaceTechnician: (stageId: string, technician: Technician) => void;
}

/** All interactive state + mutations for the order detail screen. */
export function useOrderDetail(orderId: string): UseOrderDetail {
  const order = getOrderDetailById(orderId);
  const tooth = useToothSelection(order?.selectedTeeth ?? []);
  const [priority, setPriority] = useState(order?.priority ?? false);
  const [editing, setEditing] = useState(false);
  const [stages, setStages] = useState<WorkStage[]>(
    order ? [...order.stages] : [],
  );

  const toggleEditing = useCallback(() => setEditing((e) => !e), []);

  const replaceTechnician = useCallback(
    (stageId: string, technician: Technician) => {
      setStages((list) =>
        list.map((s) => (s.id === stageId ? { ...s, technician } : s)),
      );
    },
    [],
  );

  return {
    order,
    selectedTeeth: tooth.selected,
    isToothSelected: tooth.isSelected,
    toggleTooth: tooth.toggle,
    teethLabel: tooth.label,
    priority,
    setPriority,
    editing,
    toggleEditing,
    stages,
    replaceTechnician,
  };
}
