import { Server } from "socket.io";
import { logger } from "../utils/logger.js";

export const intiSocket = (server, allowedOriginsEnv) => {
  // Convert ENV string to array safely
  const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(",").map((origin) => origin.trim())
    : [];

  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, origin);
        } else {
          return callback(new Error("Socket CORS not allowed"));
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.warn(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
