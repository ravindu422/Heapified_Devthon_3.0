import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import locationRoutes from './routes/locationRoutes.js';
import taskRoute from './routes/taskRoute.js';
import authRoutes from './routes/auth.routes.js';
import alertRoutes from './routes/alertRoutes.js';
import contactAvailabilityRoutes from './routes/contactAvailability.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health routes
app.get('/', (req, res) => {
  res.json({
    message: 'SafeLanka API Server',
    status: 'Running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
  });
});

//Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/task', taskRoute)
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/contact-availability', contactAvailabilityRoutes);
app.use('/api/admin', adminRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
