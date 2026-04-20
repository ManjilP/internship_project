"use client";

import { useState } from "react";

export default function TaskInput({
  onAdd,
}: {
  onAdd: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <div className="flex gap-2">
      <input
        className="border p-2 flex-1 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-3 rounded"
      >
        Add
      </button>
    </div>
  );
}