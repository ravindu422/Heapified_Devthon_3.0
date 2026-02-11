import "dotenv/config";
import { connectDB } from "./config/db.js";
import { intiSocket } from "./config/socket.js";
import app from "./app.js";
import mongoose from "mongoose";
import http from "http";
import dns from "dns";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5080;

const server = http.createServer(app);

/* ==============================
   OPTIONAL CUSTOM DNS
============================== */

const dnsServers = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  : [];

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
  logger.info(`Using custom DNS servers: ${dnsServers.join(", ")}`);
}

/* ==============================
   DATABASE
============================== */

connectDB();

/* ==============================
   SOCKET INIT (WITH CORS FIX)
============================== */

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const io = intiSocket(server, allowedOrigins);
app.set("io", io);

/* ==============================
   START SERVER
============================== */

server.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  logger.error("Server failed to start", err);
});

/* ==============================
   GRACEFUL SHUTDOWN
============================== */

const shutdown = () => {
  logger.info("Closing server...");
  server.close(async () => {
    try {
      await mongoose.connection.close();
      logger.warn("MongoDB closed");
      process.exit(0);
    } catch (err) {
      logger.error("MongoDB close error: ", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
