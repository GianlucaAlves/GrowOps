import { Router } from "express";
import { getTodayTasks } from "../controllers/taskController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/today", requireAuth, getTodayTasks);

export default router;
