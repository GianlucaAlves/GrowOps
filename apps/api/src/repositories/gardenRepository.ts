import prisma from "../lib/prisma";

export function listGardensByUser(userId: string) {
  return prisma.garden.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { plants: true },
      },
    },
  });
}

export function createGardenInDb(
  userId: string,
  data: { name: string; type?: string; description?: string },
) {
  return prisma.garden.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      description: data.description,
    },
  });
}

export function findGardenByIdAndUser(userId: string, gardenId: string) {
  return prisma.garden.findFirst({
    where: { id: gardenId, userId },
    include: {
      _count: {
        select: { plants: true },
      },
    },
  });
}

export function updateGardenInDb(
  userId: string,
  gardenId: string,
  data: { name?: string; type?: string; description?: string },
) {
  return prisma.garden.update({
    where: { id: gardenId, userId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
    },
    include: {
      _count: {
        select: { plants: true },
      },
    },
  });
}

export function deleteGardenInDb(userId: string, gardenId: string) {
  return prisma.garden.delete({
    where: { id: gardenId, userId },
  });
}
