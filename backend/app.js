import express from 'express';
import cors from 'cors'; 
import { errorHandler, notFound } from './middleware/errorHandler.js';
import mongoose from 'mongoose';
import alertRoutes from './routes/alertRoutes.js'

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded( { extended: true}));

//Health routes
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
        uptime: process.uptime()
    });
});

//Routes
app.use('/api/alerts', alertRoutes);

//Error Handling 
app.use(notFound);
app.use(errorHandler);

export default app;