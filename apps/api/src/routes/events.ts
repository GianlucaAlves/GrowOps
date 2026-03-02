import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  listEvents,
  listTodayEvents,
  updateEvent,
} from "../controllers/eventController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listEvents);
router.get("/today", requireAuth, listTodayEvents);
router.post("/", requireAuth, createEvent);
router.patch("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

export default router;
