// routes/resource.routes.js
import express from "express";
import {
  getResources,
  createResource,
  updateStock
} from "../controllers/resource.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, getResources);
router.post("/", protect, authorizeAdmin, createResource);
router.patch("/:id/stock", protect, authorizeAdmin, updateStock);

export default router;
