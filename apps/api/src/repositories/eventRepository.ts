import prisma from "../lib/prisma";

export function listEventsByDay(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.event.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      plant: {
        select: {
          id: true,
          name: true,
          garden: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
}

export async function findPlantByUser(userId: string, plantId: string) {
  return prisma.plant.findFirst({
    where: { id: plantId, userId },
    select: { id: true },
  });
}

export function createEventInDb(
  userId: string,
  data: {
    plantId: string;
    type:
      | "watering"
      | "feeding"
      | "pruning"
      | "training"
      | "ipm"
      | "transplant"
      | "observation"
      | "phase_change"
      | "note"
      | "photo";
    description?: string;
    note?: string;
  },
) {
  return prisma.event.create({
    data: {
      userId,
      plantId: data.plantId,
      type: data.type,
      description: data.description,
      note: data.note,
    },
    include: {
      plant: {
        select: {
          id: true,
          name: true,
          garden: { select: { id: true, name: true } },
        },
      },
    },
  });
}
