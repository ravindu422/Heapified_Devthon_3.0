import express from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * Public routes
 */
router.post("/register", register);
router.post("/login", login);

/**
 * Protected routes (any authenticated user)
 */
router.get("/me", protect, me);
router.post("/logout", protect, logout);

/**
 * Admin-only routes (RBAC)
 * Example admin endpoint
 */
router.get(
  "/admin/health",
  protect,
  authorizeAdmin,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin route working",
    });
  }
);

export default router;
