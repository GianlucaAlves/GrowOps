import { Request, Response, NextFunction } from "express";
import {
  createTaskForUser,
  getTasksForToday,
  setTaskCompletionForUser,
} from "../services/taskService";

export async function getTodayTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const tasks = await getTasksForToday(userId);
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const { title, type, dueAt } = req.body as {
      title?: string;
      type?: "watering" | "feeding" | "note" | "photo";
      dueAt?: string;
    };

    if (!title || !type) {
      return res.status(422).json({ message: "title e type são obrigatórios" });
    }

    const allowed = ["watering", "feeding", "note", "photo"];
    if (!allowed.includes(type)) {
      return res.status(422).json({ message: "type inválido" });
    }

    const task = await createTaskForUser(userId, {
      title,
      type,
      dueAt: dueAt ? new Date(dueAt) : new Date(),
    });

    return res.status(201).json({ task });
  } catch (err) {
    return next(err);
  }
}

export async function completeTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const taskIdParam = req.params.id;
    const taskId = Array.isArray(taskIdParam) ? taskIdParam[0] : taskIdParam;
    const { completed } = req.body as { completed?: boolean };

    if (typeof completed !== "boolean") {
      return res.status(422).json({
        message: "completed deve ser booleano",
      });
    }

    const updated = await setTaskCompletionForUser(userId, taskId, completed);

    if (!updated) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}
