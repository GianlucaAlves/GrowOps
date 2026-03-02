import { Request, Response, NextFunction } from "express";
import { getTasksForToday } from "../services/taskService";

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
