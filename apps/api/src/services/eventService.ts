import {
  createEventInDb,
  deleteEventInDb,
  findEventByIdAndUser,
  findPlantByUser,
  listEventsByFilters,
  listEventsByDay,
  updateEventInDb,
} from "../repositories/eventRepository";

export function getEventsForDay(userId: string, date: Date) {
  return listEventsByDay(userId, date);
}

export function getEventsForUser(
  userId: string,
  filters: {
    plantId?: string;
    gardenId?: string;
    startDate?: Date;
    endDate?: Date;
  },
) {
  return listEventsByFilters(userId, filters);
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

export async function updateEventForUser(
  userId: string,
  eventId: string,
  data: {
    plantId?: string;
    type?:
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
  const event = await findEventByIdAndUser(userId, eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (data.plantId) {
    const plant = await findPlantByUser(userId, data.plantId);
    if (!plant) {
      throw new Error("Plant not found");
    }
  }

  return updateEventInDb(userId, eventId, data);
}

export async function deleteEventForUser(userId: string, eventId: string) {
  const event = await findEventByIdAndUser(userId, eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await deleteEventInDb(userId, eventId);
}
