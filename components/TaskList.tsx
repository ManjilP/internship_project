"use client";

import { Task } from "@/app/types/task";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onDelete,
  onUpdate,
}: {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}) {
  if (tasks.length === 0) {
    return <p className="text-center">No tasks found</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}