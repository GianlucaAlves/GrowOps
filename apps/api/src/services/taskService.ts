import { getTodayTasksForUser } from "../repositories/taskRepository";
import { createTaskInDb } from "../repositories/taskRepository";
import { updateTaskCompletionInDb } from "../repositories/taskRepository";
import { findTaskByIdAndUser } from "../repositories/taskRepository";
import { updateTaskInDb } from "../repositories/taskRepository";
import { deleteTaskInDb } from "../repositories/taskRepository";

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

export async function updateTaskForUser(
  userId: string,
  taskId: string,
  data: {
    title?: string;
    type?: "watering" | "feeding" | "note" | "photo";
    dueAt?: Date;
  },
) {
  const task = await findTaskByIdAndUser(userId, taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  return updateTaskInDb(userId, taskId, data);
}

export async function deleteTaskForUser(userId: string, taskId: string) {
  const task = await findTaskByIdAndUser(userId, taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  await deleteTaskInDb(userId, taskId);
}
