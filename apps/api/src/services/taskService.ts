import { getTodayTasksForUser } from "../repositories/taskRepository";

export function getTasksForToday(userId: string) {
  return getTodayTasksForUser(userId);
}
