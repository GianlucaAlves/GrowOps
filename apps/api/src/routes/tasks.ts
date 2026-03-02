import { Router } from "express";
import {
  completeTask,
  createTask,
  getTodayTasks,
} from "../controllers/taskController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/today", requireAuth, getTodayTasks);
router.post("/", requireAuth, createTask);
router.patch("/:id/complete", requireAuth, completeTask);

export default router;
