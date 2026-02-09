import express from "express";
import { createTask, getAllTasks } from "../controllers/taskController.js";
import { createTaskValidation } from "../validators/taskValidators.js";

const router = express.Router();

router.post("/", createTaskValidation, createTask);
router.get("/", getAllTasks);

export default router;
