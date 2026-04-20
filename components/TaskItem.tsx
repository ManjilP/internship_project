"use client";

import { useState } from "react";
import { Task } from "@/app/types/task";

export default function TaskItem({
  task,
  onDelete,
  onUpdate,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  return (
    <div className="flex justify-between items-center border p-2 rounded">
      
      {isEditing ? (
        <input
          className="border p-1 flex-1 mr-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <span>{task.text}</span>
      )}

      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={() => {
              onUpdate(task.id, text);
              setIsEditing(false);
            }}
            className="text-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}