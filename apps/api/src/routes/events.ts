import { Router } from "express";
import { createEvent, listTodayEvents } from "../controllers/eventController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/today", requireAuth, listTodayEvents);
router.post("/", requireAuth, createEvent);

export default router;
