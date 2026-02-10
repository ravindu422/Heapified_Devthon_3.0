import express from "express";
import { createContactAvailability } from "../controllers/contactAvailability.controller.js";

const router = express.Router();

/**
 * @route   POST /api/contact-availability
 * @access  Public
 */
router.post("/", createContactAvailability);

export default router;
