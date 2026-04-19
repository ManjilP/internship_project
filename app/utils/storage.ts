import { Task } from "../types/task";

const KEY = "tasks";

export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(tasks));
};

export const clearTasks = () => {
  localStorage.removeItem(KEY);
};