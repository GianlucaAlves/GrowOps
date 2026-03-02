import { Router } from "express";
import { createGarden, listGardens } from "../controllers/gardenController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listGardens);
router.post("/", requireAuth, createGarden);

export default router;
