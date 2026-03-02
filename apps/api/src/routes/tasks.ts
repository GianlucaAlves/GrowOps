import { Router } from "express";
import {
  completeTask,
  createTask,
  deleteTask,
  getTodayTasks,
  updateTask,
} from "../controllers/taskController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/today", requireAuth, getTodayTasks);
router.post("/", requireAuth, createTask);
router.patch("/:id/complete", requireAuth, completeTask);
router.patch("/:id", requireAuth, updateTask);
router.delete("/:id", requireAuth, deleteTask);

export default router;
