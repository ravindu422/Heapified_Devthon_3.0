import Task from "../models/task.js";
import { validationResult } from "express-validator";

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 */
export const createTask = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { title, description, location, urgency, remarks } = req.body;

    // Create task
    const task = await Task.create({
      title,
      description,
      location,
      urgency,
      remarks,
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Task creation error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Get all tasks (for dashboard later)
 * @route   GET /api/tasks
 */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};
