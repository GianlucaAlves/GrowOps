import type { NextFunction, Request, Response } from "express";
import { createEventForUser, getEventsForDay } from "../services/eventService";

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
