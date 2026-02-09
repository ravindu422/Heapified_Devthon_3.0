// routes/resource.routes.js
import express from "express";
import {
  getResources,
  createResource,
  updateStock
} from "../controllers/resource.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getResources);
router.post("/", protect, authorize("admin"), createResource);
router.patch("/:id/stock", protect, authorize("admin", "coordinator"), updateStock);

export default router;
