import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';

export const intiSocket = (server, allowedOrigins) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        logger.infO(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
            logger.warn(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}