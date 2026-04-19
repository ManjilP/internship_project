import { readTasks, writeTasks } from "../data";

// GET one task (also makes “open in browser” show JSON instead of an empty body)
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return Response.json({ message: "Task not found" }, { status: 404 });
  }
  return Response.json(task);
}

// UPDATE task  
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return Response.json({ message: "Task not found" }, { status: 404 });
  }

  tasks[index] = {
    ...tasks[index],
    text: body.text ?? tasks[index].text,
  };

  await writeTasks(tasks);

  return Response.json(tasks[index]);
}

// DELETE task
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return Response.json({ message: "Task not found" }, { status: 404 });
  }

  const deleted = tasks.splice(index, 1);
  await writeTasks(tasks);

  return Response.json(deleted[0]);
}
