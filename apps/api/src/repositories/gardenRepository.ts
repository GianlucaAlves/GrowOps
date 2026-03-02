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
