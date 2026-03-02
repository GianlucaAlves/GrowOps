import { Router } from "express";
import {
  createPlant,
  deletePlant,
  listPlants,
  updatePlant,
} from "../controllers/plantController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listPlants);
router.post("/", requireAuth, createPlant);
router.patch("/:id", requireAuth, updatePlant);
router.delete("/:id", requireAuth, deletePlant);

export default router;
