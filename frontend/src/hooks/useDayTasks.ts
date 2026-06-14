"use client";

import { DAY_TASKS } from "@/lib/mocks/tasks";
import { DayTask } from "@/lib/types/task";
import { useCallback, useState } from "react";


interface UseDayTasks {
  tasks: DayTask[];
  toggle: (id: string) => void;
}

/** Расписание дня: переключение статуса выполнения задачи. */
export function useDayTasks(): UseDayTasks {
  const [tasks, setTasks] = useState<DayTask[]>(DAY_TASKS);

  const toggle = useCallback((id: string) => {
    setTasks((list) =>
      list.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }, []);

  return { tasks, toggle };
}
