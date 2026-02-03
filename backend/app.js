import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import alertRoutes from "./routes/alertRoutes.js";

const app = express();

/* ======================================================
   CORS CONFIGURATION (FIXED & ROBUST)
   ====================================================== */

// Read allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Explicit preflight support (VERY IMPORTANT)
app.options("*", cors());

/* ======================================================
   BODY PARSERS
   ====================================================== */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   HEALTH & ROOT ROUTES
   ====================================================== */
app.get("/", (req, res) => {
  res.json({
    message: "SafeLanka API Server",
    status: "Running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime()
  });
});

/* ======================================================
   API ROUTES
   ====================================================== */
app.use('/api/alerts', alertRoutes);

/* ======================================================
   ERROR HANDLING
   ====================================================== */
app.use(notFound);
app.use(errorHandler);

export default app;
