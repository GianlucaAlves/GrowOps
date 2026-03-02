import prisma from "../lib/prisma";

export function listPlantsByUser(userId: string, gardenId?: string) {
  return prisma.plant.findMany({
    where: {
      userId,
      ...(gardenId ? { gardenId } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      garden: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function ensureGardenOwnership(userId: string, gardenId: string) {
  const garden = await prisma.garden.findFirst({
    where: { id: gardenId, userId },
    select: { id: true },
  });

  return !!garden;
}

export function createPlantInDb(
  userId: string,
  data: {
    gardenId?: string;
    name: string;
    species?: string;
    location?: string;
    notes?: string;
  },
) {
  return prisma.plant.create({
    data: {
      userId,
      gardenId: data.gardenId,
      name: data.name,
      species: data.species,
      location: data.location,
      notes: data.notes,
    },
    include: {
      garden: {
        select: { id: true, name: true },
      },
    },
  });
}

export function findPlantByIdAndUser(userId: string, plantId: string) {
  return prisma.plant.findFirst({
    where: { id: plantId, userId },
    include: {
      garden: {
        select: { id: true, name: true },
      },
    },
  });
}

export function updatePlantInDb(
  userId: string,
  plantId: string,
  data: {
    gardenId?: string | null;
    name?: string;
    species?: string;
    location?: string;
    notes?: string;
  },
) {
  return prisma.plant.update({
    where: { id: plantId, userId },
    data: {
      ...(data.gardenId !== undefined ? { gardenId: data.gardenId } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.species !== undefined ? { species: data.species } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    },
    include: {
      garden: {
        select: { id: true, name: true },
      },
    },
  });
}

export function deletePlantInDb(userId: string, plantId: string) {
  return prisma.plant.delete({
    where: { id: plantId, userId },
  });
}
