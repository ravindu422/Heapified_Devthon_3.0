import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import crisisRoutes from './routes/crisis.routes.js';
import resourcesRoutes from './routes/resource.routes.js';
import updatesRoutes from './routes/update.routes.js';
import locationRoutes from './routes/locationRoutes.js';
import taskRoute from './routes/taskRoute.js';
import authRoutes from './routes/auth.routes.js';
import alertRoutes from './routes/alertRoutes.js';
import resourceRoutes from './routes/resource.routes.js';
import safeZoneRoutes from './routes/safeZone.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import chatbotRoutes from './routes/chatbotRoutes.js';


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
app.use('/api/crisis', crisisRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/task',taskRoute)
app.use('/api/auth', authRoutes);
app.use('/api/safe-zones', safeZoneRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;