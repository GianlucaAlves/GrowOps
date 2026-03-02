import type { NextFunction, Request, Response } from "express";
import { createPlantForUser, getPlantsForUser } from "../services/plantService";

export async function listPlants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const gardenId =
      typeof req.query.gardenId === "string" ? req.query.gardenId : undefined;

    const plants = await getPlantsForUser(req.user.id, gardenId);
    return res.json({ plants });
  } catch (err) {
    return next(err);
  }
}

export async function createPlant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, species, location, notes, gardenId } = req.body as {
      name?: string;
      species?: string;
      location?: string;
      notes?: string;
      gardenId?: string;
    };

    if (!name?.trim()) {
      return res.status(422).json({ message: "name é obrigatório" });
    }

    const plant = await createPlantForUser(req.user.id, {
      name: name.trim(),
      species: species?.trim() || undefined,
      location: location?.trim() || undefined,
      notes: notes?.trim() || undefined,
      gardenId: gardenId?.trim() || undefined,
    });

    return res.status(201).json({ plant });
  } catch (err) {
    if (err instanceof Error && err.message === "Garden not found") {
      return res.status(404).json({ message: "Jardim não encontrado" });
    }

    return next(err);
  }
}
