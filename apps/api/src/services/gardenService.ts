import {
  createGardenInDb,
  listGardensByUser,
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
