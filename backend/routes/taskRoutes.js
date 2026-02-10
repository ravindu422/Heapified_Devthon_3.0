import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Task from "../models/task.js";
import mongoose from "mongoose";

const router = express.Router();

// Sample task data
const tasks = [
  {
    id: 1,
    priority: "medium",
    title: "Emergency Medical Assistance",
    location: "Kurunegala - Lake Round",
    contact: "+94 77 345 6791",
    contactPerson: "Mr. P. Samaraweera",
    expectedSupport: ["Basic treatment", "Basic medicines", "Patient triage"],
  },
  {
    id: 2,
    priority: "high",
    title: "Flood Evacuation Transport",
    location: "Welawa - Lowland Zone",
    contact: "+94 76 551 7709",
    contactPerson: "Ms. K. Perera",
    expectedSupport: [
      "Emergency medical supplies",
      "Assist elderly and children",
      "Coordinate evacuation routes",
    ],
  },
  {
    id: 3,
    priority: "low",
    title: "Temporary Shelter Setup",
    location: "Moladena - School Grounds",
    contact: "+94 77 452 8896",
    contactPerson: "Mr. R. Silva",
    expectedSupport: [
      "Set up tents",
      "Distribute food rations",
      "Secure shelter areas",
    ],
  },
];

// GET /api/tasks - Get all available tasks
router.get("/", (req, res) => {
  res.status(200).json({ success: true, tasks });
});

// POST /api/tasks/accept - Accept a task (assign to user)
router.post("/accept", asyncHandler(async (req, res) => {
  const { taskId, userId } = req.body;

  if (!taskId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Task ID and User ID are required"
    });
  }

  // Find the task from sample data
  const task = tasks.find(t => t.id === parseInt(taskId));
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  // Handle volunteerId - convert to ObjectId if valid, otherwise skip for test users
  let volunteerObjectId;
  try {
    // Try to convert to ObjectId, if it fails, it's probably a test user ID
    volunteerObjectId = new mongoose.Types.ObjectId(userId);
  } catch (error) {
    // For test users or invalid ObjectIds, we'll skip the volunteerId field
    console.log('Using test user ID, skipping ObjectId conversion');
    volunteerObjectId = null;
  }

  // Create a new task assignment in database
  const taskData = {
    title: task.title,
    description: `Task accepted by volunteer. Location: ${task.location}. Contact: ${task.contact}. Contact Person: ${task.contactPerson}. Expected Support: ${task.expectedSupport.join(', ')}`,
    location: task.location,
    urgency: task.priority === 'high' ? 'Critical' : task.priority === 'medium' ? 'High' : 'Medium',
    status: "Pending", // Start with "Pending" status (shows as "Available" in frontend)
    originalTaskId: task.id, // Keep reference to original task
  };

  // Only add volunteerId if it's a valid ObjectId
  if (volunteerObjectId) {
    taskData.volunteerId = volunteerObjectId;
  }

  const assignedTask = new Task(taskData);
  await assignedTask.save();

  res.status(200).json({
    success: true,
    message: "Task accepted successfully",
    assignedTask: {
      id: assignedTask._id,
      originalTaskId: assignedTask.originalTaskId,
      title: assignedTask.title,
      description: assignedTask.description,
      location: assignedTask.location,
      status: assignedTask.status,
      urgency: assignedTask.urgency,
      createdAt: assignedTask.createdAt
    }
  });
}));

// GET /api/tasks/my-active/:userId - Get user's active tasks
router.get("/my-active/:userId", asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    let activeTasks;

    // Try to convert userId to ObjectId for database query
    try {
      const volunteerObjectId = new mongoose.Types.ObjectId(userId);
      // Get all tasks assigned to this user with valid ObjectId
      activeTasks = await Task.find({ volunteerId: volunteerObjectId }).sort({ createdAt: -1 });
    } catch (error) {
      // For test users or invalid ObjectIds, return all tasks without volunteerId filter
      // This is a fallback for development/testing
      console.log('Using test user ID, fetching all tasks without volunteer filter');
      // Get all tasks with status "Pending" (newly accepted) or "In Progress"
      activeTasks = await Task.find({
        status: { $in: ["Pending", "In Progress"] }
      }).sort({ createdAt: -1 });
    }

    // Transform tasks to match frontend format
    const formattedTasks = activeTasks.map(task => ({
      id: task._id,
      originalTaskId: task.originalTaskId,
      title: task.title,
      description: task.description,
      status: task.status === "In Progress" ? "active" : task.status === "Completed" ? "completed" : task.status === "Pending" ? "available" : "available",
      date: new Date(task.createdAt).toLocaleDateString('en-GB'),
      priorityColor: task.urgency === 'Critical' ? 'red' : task.urgency === 'High' ? 'yellow' : 'green'
    }));

    console.log('Backend: Returning tasks:', formattedTasks);

    res.status(200).json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching active tasks:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active tasks"
    });
  }
}));

// PUT /api/tasks/:taskId/status - Update task status
router.put("/:taskId/status", asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId || !status) {
    return res.status(400).json({
      success: false,
      message: "Task ID and status are required"
    });
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  // Update status
  const dbStatus = status === 'active' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Pending';
  task.status = dbStatus;
  await task.save();

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    task: {
      id: task._id,
      title: task.title,
      status: task.status === "In Progress" ? "active" : task.status === "Completed" ? "completed" : "available"
    }
  });
}));

// GET /api/stats/:userId - Get user's statistics
router.get("/stats/:userId", asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    let userTasks;

    // Try to convert userId to ObjectId for database query
    try {
      const volunteerObjectId = new mongoose.Types.ObjectId(userId);
      // Get all tasks assigned to this user with valid ObjectId
      userTasks = await Task.find({ volunteerId: volunteerObjectId });
    } catch (error) {
      // For test users or invalid ObjectIds, return all tasks without volunteerId filter
      console.log('Using test user ID for stats calculation');
      userTasks = await Task.find({
        status: { $in: ["Pending", "In Progress", "Completed"] }
      });
    }

    // Calculate statistics
    const completedTasks = userTasks.filter(task => task.status === "Completed").length;
    const inProgressTasks = userTasks.filter(task => task.status === "In Progress").length;

    // Calculate hours contributed (assume 4 hours per task)
    const hoursContributed = (completedTasks + inProgressTasks) * 4;

    // Calculate impact score (based on task urgency and completion)
    let impactScore = 0;
    userTasks.forEach(task => {
      if (task.status === "Completed") {
        if (task.urgency === "Critical") impactScore += 10;
        else if (task.urgency === "High") impactScore += 7;
        else if (task.urgency === "Medium") impactScore += 5;
        else impactScore += 3;
      } else if (task.status === "In Progress") {
        if (task.urgency === "Critical") impactScore += 5;
        else if (task.urgency === "High") impactScore += 3;
        else if (task.urgency === "Medium") impactScore += 2;
        else impactScore += 1;
      }
    });

    console.log('Backend: Stats calculated for user', userId, {
      completedTasks,
      hoursContributed,
      impactScore,
      totalTasks: userTasks.length
    });

    res.status(200).json({
      success: true,
      stats: {
        completedTasks,
        hoursContributed,
        impactScore,
        totalTasks: userTasks.length
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics"
    });
  }
}));

export default router;
