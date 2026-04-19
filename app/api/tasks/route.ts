import { readTasks, writeTasks } from "./data";

// GET all tasks
export async function GET() {
  const tasks = await readTasks();
  return Response.json(tasks);
}

// POST new task
export async function POST(req: Request) {
  const body = await req.json();

  const tasks = await readTasks();
  const newTask = {
    id: Date.now().toString(),
    text: body.text,
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  return Response.json(newTask);
}
