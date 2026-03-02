import type { NextFunction, Request, Response } from "express";
import {
  createEventForUser,
  deleteEventForUser,
  getEventsForDay,
  getEventsForUser,
  updateEventForUser,
} from "../services/eventService";

const allowedTypes = [
  "watering",
  "feeding",
  "pruning",
  "training",
  "ipm",
  "transplant",
  "observation",
  "phase_change",
  "note",
  "photo",
] as const;

type EventType = (typeof allowedTypes)[number];

export async function listEvents(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const plantId =
      typeof req.query.plantId === "string" ? req.query.plantId : undefined;
    const gardenId =
      typeof req.query.gardenId === "string" ? req.query.gardenId : undefined;

    const startDateRaw =
      typeof req.query.startDate === "string"
        ? new Date(req.query.startDate)
        : undefined;
    const endDateRaw =
      typeof req.query.endDate === "string"
        ? new Date(req.query.endDate)
        : undefined;

    const startDate =
      startDateRaw && !Number.isNaN(startDateRaw.getTime())
        ? startDateRaw
        : undefined;
    const endDate =
      endDateRaw && !Number.isNaN(endDateRaw.getTime())
        ? endDateRaw
        : undefined;

    const events = await getEventsForUser(req.user.id, {
      plantId,
      gardenId,
      startDate,
      endDate,
    });

    return res.json({ events });
  } catch (err) {
    return next(err);
  }
}

export async function listTodayEvents(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dateParam =
      typeof req.query.date === "string"
        ? new Date(req.query.date)
        : new Date();

    const date = Number.isNaN(dateParam.getTime()) ? new Date() : dateParam;
    const events = await getEventsForDay(req.user.id, date);

    return res.json({ events });
  } catch (err) {
    return next(err);
  }
}

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { plantId, type, description, note } = req.body as {
      plantId?: string;
      type?: EventType;
      description?: string;
      note?: string;
    };

    if (!plantId?.trim() || !type) {
      return res
        .status(422)
        .json({ message: "plantId e type são obrigatórios" });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(422).json({ message: "type inválido" });
    }

    const event = await createEventForUser(req.user.id, {
      plantId: plantId.trim(),
      type,
      description: description?.trim() || undefined,
      note: note?.trim() || undefined,
    });

    return res.status(201).json({ event });
  } catch (err) {
    if (err instanceof Error && err.message === "Plant not found") {
      return res.status(404).json({ message: "Planta não encontrada" });
    }

    return next(err);
  }
}

export async function updateEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const eventId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { plantId, type, description, note } = req.body as {
      plantId?: string;
      type?: EventType;
      description?: string;
      note?: string;
    };

    if (type && !allowedTypes.includes(type)) {
      return res.status(422).json({ message: "type inválido" });
    }

    const event = await updateEventForUser(req.user.id, eventId, {
      plantId: plantId?.trim() || undefined,
      type,
      description: description?.trim(),
      note: note?.trim(),
    });

    return res.json({ event });
  } catch (err) {
    if (err instanceof Error && err.message === "Plant not found") {
      return res.status(404).json({ message: "Planta não encontrada" });
    }

    if (err instanceof Error && err.message === "Event not found") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }

    return next(err);
  }
}

export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const eventId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deleteEventForUser(req.user.id, eventId);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Event not found") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }

    return next(err);
  }
}
