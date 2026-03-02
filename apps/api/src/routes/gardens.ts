import { Router } from "express";
import {
  createGarden,
  deleteGarden,
  listGardens,
  updateGarden,
} from "../controllers/gardenController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listGardens);
router.post("/", requireAuth, createGarden);
router.patch("/:id", requireAuth, updateGarden);
router.delete("/:id", requireAuth, deleteGarden);

export default router;
