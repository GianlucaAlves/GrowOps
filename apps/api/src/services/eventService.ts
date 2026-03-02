import {
  createEventInDb,
  findPlantByUser,
  listEventsByDay,
} from "../repositories/eventRepository";

export function getEventsForDay(userId: string, date: Date) {
  return listEventsByDay(userId, date);
}

export async function createEventForUser(
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
  const plant = await findPlantByUser(userId, data.plantId);

  if (!plant) {
    throw new Error("Plant not found");
  }

  return createEventInDb(userId, data);
}
