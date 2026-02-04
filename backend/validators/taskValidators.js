import { body } from "express-validator";

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Task title is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("urgency")
    .notEmpty()
    .withMessage("Urgency level is required")
    .isIn(["Critical", "High", "Medium", "Low"])
    .withMessage("Invalid urgency level"),
];
