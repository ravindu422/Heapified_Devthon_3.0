import mongoose from "mongoose";
import { logger } from "../utils/logger.js";


const buildConnectOptions = () => ({
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

const tryConnect = async (uri, label) => {
  if (!uri) return false;
  try {
    await mongoose.connect(uri, buildConnectOptions());
    logger.success(`MongoDB connected successfully (${label})`);
    return true;
  } catch (error) {
    logger.error(`MongoDB connection error (${label}):`, error);
    return false;
  }
};

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_URI_FALLBACK;

  if (!primaryUri && !fallbackUri) {
    logger.error(
      "Missing MongoDB connection string. Set MONGODB_URI (or MONGODB_URI_FALLBACK).",
    );
    process.exit(1);
  }

  const connected = await tryConnect(primaryUri, "primary");
  if (!connected && fallbackUri) {
    const fallbackConnected = await tryConnect(fallbackUri, "fallback");
    if (!fallbackConnected) {
      logger.warn(
        "Could not connect to MongoDB. Server will continue without database.",
      );
    }
  } else if (!connected) {
    logger.warn(
      "Could not connect to MongoDB. Server will continue without database.",
    );
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