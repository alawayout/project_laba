"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ARCH_TEETH,
  buildStages,
  newFitting,
  photoFromUrl,
} from "@/lib/order-form";
import type {
  DateTimeValue,
  OrderFormFitting,
  OrderFormValues,
  ToothArch,
} from "@/lib/types";

/** Состояние и операции формы создания/редактирования наряда. */
export function useOrderForm(initial: OrderFormValues) {
  const [values, setValues] = useState<OrderFormValues>(initial);

  const setField = useCallback(
    <K extends keyof OrderFormValues>(key: K, value: OrderFormValues[K]) =>
      setValues((v) => ({ ...v, [key]: value })),
    [],
  );

  /** Смена вида работы пересобирает шаблон этапов. */
  const changeWorkType = useCallback(
    (workTypeId: string) =>
      setValues((v) => ({ ...v, workTypeId, stages: buildStages(workTypeId) })),
    [],
  );

  const toggleTooth = useCallback(
    (tooth: number) =>
      setValues((v) => ({
        ...v,
        teeth: v.teeth.includes(tooth)
          ? v.teeth.filter((n) => n !== tooth)
          : [...v.teeth, tooth],
      })),
    [],
  );

  const isToothSelected = useCallback(
    (tooth: number) => values.teeth.includes(tooth),
    [values.teeth],
  );

  const selectArch = useCallback(
    (arch: ToothArch) =>
      setValues((v) => ({ ...v, teeth: [...ARCH_TEETH[arch]] })),
    [],
  );

  const clearTeeth = useCallback(
    () => setValues((v) => ({ ...v, teeth: [] })),
    [],
  );

  const teethLabel = useMemo(() => {
    if (values.teeth.length === 0) return "—";
    return [...values.teeth].sort((a, b) => a - b).join("; ") + ";";
  }, [values.teeth]);

  const assignTechnician = useCallback(
    (stageId: string, technicianId: string | null) =>
      setValues((v) => ({
        ...v,
        stages: v.stages.map((s) =>
          s.id === stageId ? { ...s, technicianId } : s,
        ),
      })),
    [],
  );

  const setDue = useCallback(
    (patch: Partial<DateTimeValue>) =>
      setValues((v) => ({ ...v, due: { ...v.due, ...patch } })),
    [],
  );

  const addFitting = useCallback(
    () => setValues((v) => ({ ...v, fittings: [...v.fittings, newFitting()] })),
    [],
  );

  const removeFitting = useCallback(
    (id: string) =>
      setValues((v) => ({
        ...v,
        fittings: v.fittings.filter((f) => f.id !== id),
      })),
    [],
  );

  const setFitting = useCallback(
    (id: string, patch: Partial<OrderFormFitting>) =>
      setValues((v) => ({
        ...v,
        fittings: v.fittings.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      })),
    [],
  );

  const togglePriority = useCallback(
    () => setValues((v) => ({ ...v, priority: !v.priority })),
    [],
  );

  const addPhotos = useCallback(
    (files: FileList) =>
      setValues((v) => ({
        ...v,
        photos: [
          ...v.photos,
          ...Array.from(files).map((file) =>
            photoFromUrl(URL.createObjectURL(file)),
          ),
        ],
      })),
    [],
  );

  const removePhoto = useCallback(
    (id: string) =>
      setValues((v) => ({ ...v, photos: v.photos.filter((p) => p.id !== id) })),
    [],
  );

  const canSubmit = useMemo(
    () => values.number.trim() !== "" && values.patient.trim() !== "",
    [values.number, values.patient],
  );

  return {
    values,
    setField,
    changeWorkType,
    toggleTooth,
    isToothSelected,
    selectArch,
    clearTeeth,
    teethLabel,
    assignTechnician,
    setDue,
    addFitting,
    removeFitting,
    setFitting,
    togglePriority,
    addPhotos,
    removePhoto,
    canSubmit,
  };
}
