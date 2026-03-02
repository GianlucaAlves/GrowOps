import {
  createPlantInDb,
  ensureGardenOwnership,
  listPlantsByUser,
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
