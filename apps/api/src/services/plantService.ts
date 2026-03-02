import {
  createPlantInDb,
  deletePlantInDb,
  ensureGardenOwnership,
  findPlantByIdAndUser,
  listPlantsByUser,
  updatePlantInDb,
} from "../repositories/plantRepository";

export function getPlantsForUser(userId: string, gardenId?: string) {
  return listPlantsByUser(userId, gardenId);
}

export async function createPlantForUser(
  userId: string,
  data: {
    gardenId?: string;
    name: string;
    species?: string;
    location?: string;
    notes?: string;
  },
) {
  if (data.gardenId) {
    const hasAccess = await ensureGardenOwnership(userId, data.gardenId);

    if (!hasAccess) {
      throw new Error("Garden not found");
    }
  }

  return createPlantInDb(userId, data);
}

export async function updatePlantForUser(
  userId: string,
  plantId: string,
  data: {
    gardenId?: string;
    name?: string;
    species?: string;
    location?: string;
    notes?: string;
  },
) {
  const plant = await findPlantByIdAndUser(userId, plantId);
  if (!plant) {
    throw new Error("Plant not found");
  }

  if (data.gardenId) {
    const hasAccess = await ensureGardenOwnership(userId, data.gardenId);
    if (!hasAccess) {
      throw new Error("Garden not found");
    }
  }

  return updatePlantInDb(userId, plantId, {
    ...data,
    gardenId: data.gardenId === "" ? null : data.gardenId,
  });
}

export async function deletePlantForUser(userId: string, plantId: string) {
  const plant = await findPlantByIdAndUser(userId, plantId);
  if (!plant) {
    throw new Error("Plant not found");
  }

  await deletePlantInDb(userId, plantId);
}
