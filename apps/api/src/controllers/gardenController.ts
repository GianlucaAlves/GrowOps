import type { NextFunction, Request, Response } from "express";
import {
  createGardenForUser,
  deleteGardenForUser,
  getGardensForUser,
  updateGardenForUser,
} from "../services/gardenService";

export async function listGardens(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const gardens = await getGardensForUser(req.user.id);
    return res.json({ gardens });
  } catch (err) {
    return next(err);
  }
}

export async function createGarden(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, type, description } = req.body as {
      name?: string;
      type?: string;
      description?: string;
    };

    if (!name?.trim()) {
      return res.status(422).json({ message: "name é obrigatório" });
    }

    const garden = await createGardenForUser(req.user.id, {
      name: name.trim(),
      type: type?.trim() || undefined,
      description: description?.trim() || undefined,
    });

    return res.status(201).json({ garden });
  } catch (err) {
    return next(err);
  }
}

export async function updateGarden(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const gardenId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { name, type, description } = req.body as {
      name?: string;
      type?: string;
      description?: string;
    };

    if (name !== undefined && !name.trim()) {
      return res.status(422).json({ message: "name é obrigatório" });
    }

    const garden = await updateGardenForUser(req.user.id, gardenId, {
      name: name?.trim(),
      type: type?.trim(),
      description: description?.trim(),
    });

    return res.json({ garden });
  } catch (err) {
    if (err instanceof Error && err.message === "Garden not found") {
      return res.status(404).json({ message: "Jardim não encontrado" });
    }

    return next(err);
  }
}

export async function deleteGarden(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const gardenId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deleteGardenForUser(req.user.id, gardenId);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Garden not found") {
      return res.status(404).json({ message: "Jardim não encontrado" });
    }

    return next(err);
  }
}
