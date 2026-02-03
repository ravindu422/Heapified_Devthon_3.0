import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.success("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB Connection Error:", error.message);
    logger.warn("⚠️ Server running WITHOUT database connection");
    // ❌ DO NOT exit process
  }
};

// Connection events
mongoose.connection.on("connected", () => {
  logger.success("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected");
});
