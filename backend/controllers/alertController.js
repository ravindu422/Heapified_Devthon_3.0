import Alert from "../models/alert.js";
import { logger } from "../utils/logger.js";

// @desc  Create a new alert
// @route POST /api/alerts
export const createAlert = async (req, res) => {
    try {
        const { title, message, severityLevel, affectedAreas, remarks } = req.body;

        const alert = await Alert.create({
            title, message, severityLevel, affectedAreas, remarks: remarks || ''
        });

        res.status(200).json({
            success: true,
            message: 'Alert created successfully',
            data: alert
        });

        logger.success('Alert created successfully');

    } catch (error) {
        logger.error('Error creating alert:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create alert',
            error: error.message
        });
    }
};


// @desc  Get recent alerts
// @route GET /api/alerts/recent
export const getRecentAlerts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const alerts = await Alert.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();

        const alertWithTimeAgo = alerts.map(alert => ({
            ...alert,
            timeAgo: getTimeAgo(alert.createdAt)
        }));

        res.status(200).json({
            success: true,
            data: alertWithTimeAgo
        });

    } catch (error) {
        logger.error('Error fecthing recent alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent alerts',
            error: error.message
        });
    }
};


//Helper function to calculate time ago 
const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff/ 60000);
    const hours = Math.floor(diff/ 3600000);
    const days = Math.floor(diff/ 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`; 
}