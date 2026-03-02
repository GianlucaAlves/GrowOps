import { Router } from "express";
import { createPlant, listPlants } from "../controllers/plantController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listPlants);
router.post("/", requireAuth, createPlant);

export default router;
