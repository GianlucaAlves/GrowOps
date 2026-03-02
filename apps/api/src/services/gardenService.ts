import {
  createGardenInDb,
  deleteGardenInDb,
  findGardenByIdAndUser,
  listGardensByUser,
  updateGardenInDb,
} from "../repositories/gardenRepository";

export function getGardensForUser(userId: string) {
  return listGardensByUser(userId);
}

export function createGardenForUser(
  userId: string,
  data: { name: string; type?: string; description?: string },
) {
  return createGardenInDb(userId, data);
}

export async function updateGardenForUser(
  userId: string,
  gardenId: string,
  data: { name?: string; type?: string; description?: string },
) {
  const garden = await findGardenByIdAndUser(userId, gardenId);
  if (!garden) {
    throw new Error("Garden not found");
  }

  return updateGardenInDb(userId, gardenId, data);
}

export async function deleteGardenForUser(userId: string, gardenId: string) {
  const garden = await findGardenByIdAndUser(userId, gardenId);
  if (!garden) {
    throw new Error("Garden not found");
  }

  await deleteGardenInDb(userId, gardenId);
}
