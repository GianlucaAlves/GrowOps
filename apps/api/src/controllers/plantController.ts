import type { NextFunction, Request, Response } from "express";
import {
  createPlantForUser,
  deletePlantForUser,
  getPlantsForUser,
  updatePlantForUser,
} from "../services/plantService";

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

export async function updatePlant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const plantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { name, species, location, notes, gardenId } = req.body as {
      name?: string;
      species?: string;
      location?: string;
      notes?: string;
      gardenId?: string;
    };

    if (name !== undefined && !name.trim()) {
      return res.status(422).json({ message: "name é obrigatório" });
    }

    const plant = await updatePlantForUser(req.user.id, plantId, {
      name: name?.trim(),
      species: species?.trim(),
      location: location?.trim(),
      notes: notes?.trim(),
      gardenId: gardenId?.trim(),
    });

    return res.json({ plant });
  } catch (err) {
    if (err instanceof Error && err.message === "Garden not found") {
      return res.status(404).json({ message: "Jardim não encontrado" });
    }

    if (err instanceof Error && err.message === "Plant not found") {
      return res.status(404).json({ message: "Planta não encontrada" });
    }

    return next(err);
  }
}

export async function deletePlant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const plantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deletePlantForUser(req.user.id, plantId);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Plant not found") {
      return res.status(404).json({ message: "Planta não encontrada" });
    }

    return next(err);
  }
}
