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
