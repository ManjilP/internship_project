import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Task } from "@/app/types/task";

const file = path.join(process.cwd(), "data", "tasks.json");

async function ensureDataDir() {
  await mkdir(path.dirname(file), { recursive: true });
}

export async function readTasks(): Promise<Task[]> {
  try {
    const raw = await readFile(file, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  await ensureDataDir();
  await writeFile(file, JSON.stringify(tasks, null, 2), "utf-8");
}
