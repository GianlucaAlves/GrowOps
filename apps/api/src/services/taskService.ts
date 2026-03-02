import { getTodayTasksForUser } from "../repositories/taskRepository";
import { createTaskInDb } from "../repositories/taskRepository";
import { updateTaskCompletionInDb } from "../repositories/taskRepository";

export function getTasksForToday(userId: string) {
  return getTodayTasksForUser(userId);
}

export function createTaskForUser(
  userId: string,
  data: {
    title: string;
    type: "watering" | "feeding" | "note" | "photo";
    dueAt: Date;
  },
) {
  return createTaskInDb(userId, data);
}

export async function setTaskCompletionForUser(
  userId: string,
  taskId: string,
  completed: boolean,
) {
  const result = await updateTaskCompletionInDb(userId, taskId, completed);
  return result.count > 0;
}
