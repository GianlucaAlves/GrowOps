import prisma from "../lib/prisma";

export function getTodayTasksForUser(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return prisma.task.findMany({
    where: {
      userId,
      dueAt: { gte: start, lte: end },
    },
    orderBy: { dueAt: "asc" },
  });
}

export function createTaskInDb(
  userId: string,
  data: {
    title: string;
    type: "watering" | "feeding" | "note" | "photo";
    dueAt: Date;
  },
) {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      type: data.type,
      dueAt: data.dueAt,
      completed: false,
    },
  });
}

export function updateTaskCompletionInDb(
  userId: string,
  taskId: string,
  completed: boolean,
) {
  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      completed,
    },
  });
}
