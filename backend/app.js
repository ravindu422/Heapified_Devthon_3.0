import express from 'express';
import cors from 'cors'; 
import { errorHandler, notFound } from './middleware/errorHandler.js';
import mongoose from 'mongoose';
import crisisRoutes from './routes/crisis.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import updatesRoutes from './routes/update.routes.js';


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
app.use('/api/crisis', crisisRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/updates', updatesRoutes);
//Error Handling 
app.use(notFound);
app.use(errorHandler);

export default app;




