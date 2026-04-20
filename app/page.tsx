"use client";

import { useEffect, useState } from "react";
import { Task } from "./types/task";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Load tasks
  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("/api/tasks")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            typeof data?.message === "string" ? data.message : "Failed to load tasks"
          );
        }
        return data;
      })
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load tasks")
      )
      .finally(() => setLoading(false));
  }, []);

  // Add task
  const addTask = async (text: string) => {
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch {
      setError("Failed to add task");
    }
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          typeof data?.message === "string" ? data.message : "Failed to delete task"
        );
        return;
      }
      setError("");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  // Update task
  const updateTask = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          typeof data?.message === "string" ? data.message : "Failed to update task"
        );
        return;
      }
      setError("");
      const updated = data as Task;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: updated.text } : t))
      );
    } catch {
      setError("Failed to update task");
    }
  };

  // Clear tasks
  const handleClear = () => {
    setTasks([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">

        {}
        <h1 className="text-xl font-semibold text-center text-gray-700">
          Task Manager
        </h1>

        {}
        <TaskInput onAdd={addTask} />

        {}
        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {}
        {!loading && (
          <TaskList
            tasks={tasks}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        )}

        {}
       

        {}
        <button
          onClick={handleClear}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Clear All
        </button>

      </div>
    </div>
  );
}