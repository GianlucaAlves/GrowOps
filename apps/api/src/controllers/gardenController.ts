import type { NextFunction, Request, Response } from "express";
import {
  createGardenForUser,
  getGardensForUser,
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
