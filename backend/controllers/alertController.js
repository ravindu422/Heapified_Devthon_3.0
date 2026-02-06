import Alert from "../models/alert.js";
import { logger } from "../utils/logger.js";

// @desc  Create a new alert
// @route POST /api/alerts
export const createAlert = async (req, res) => {
    try {
        const { title, message, alertType, severityLevel, affectedAreas, remarks } = req.body;

        const transformedAreas = affectedAreas.map(area => ({
            name: area.name,
            displayName: area.displayName,
            geometry: area.geometry,
            centerPoint: {
                type: 'Point',
                coordinates: [
                    area.coordinates.longitude,
                    area.coordinates.latitude
                ]
            },
            boundingBox: area.boundingBox
        }));

        const alert = await Alert.create({
            title, 
            message, 
            alertType,
            severityLevel, 
            affectedAreas: transformedAreas, 
            remarks: remarks || ''
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


// @desc  Get all alerts with pagination and filtering 
// @route GET /api/alerts
export const getAlert = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status, severityLevel, 
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = {};
        if (status) query.status = status;
        if (severityLevel) query.severityLevel = severityLevel;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'desc' ? -1 : 1;

        const [alert, total] = await Promise.all([
            Alert.find(query)
                .sort({ [sortBy]: sortOrder })
                .limit(parseInt(limit))
                .skip(skip)
                .lean()
                .exec(),
            Alert.countDocuments(query)
        ]);

        const alertWithTimeAgo = alert.map(alert => ({
            ...alert,
            timeAgo: getTimeAgo(alert.createdAt)
        }));

        res.status(200).json({
            success: true,
            data: alertWithTimeAgo,
            pagination: {
                currentPage: parseInt(page),
                totalPage: Math.ceil(total/ parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch alerts',
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

// @desc  Get single alert by ID
// @route GET /api/alerts/:id
export const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id).lean();

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...alert,
                timeAgo: getTimeAgo(alert.createdAt)
            }
        });
    } catch (error) {
        logger.error('Error fetching alert:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid alert ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fecth alert',
            error: error.message
        });
    }
};

// @desc   Update alert
// @route  PUT /api/alerts/:id
export const updateAlert = async (req, res) => {
    try {
        const { title, message, alertType, severityLevel, affectedAreas, remarks } = req.body;

        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        if (title !== undefined) alert.title = title;
        if (message !== undefined) alert.message = message;
        if (alertType !== undefined) alert.alertType = alertType;
        if (severityLevel !== undefined) alert.severityLevel = severityLevel;

        if (affectedAreas !== undefined) {
            const transformedAreas = affectedAreas.map(area => ({
                name: area.name,
                displayName: area.displayName,
                geometry: area.geometry,
                centerPoint: area.centerPoint || {
                    type: 'Point',
                    coordinates: [
                        area.coordinates?.longitude || 0,
                        area.coordinates?.latitude || 0
                    ]
                },
                boundingBox: area.boundingBox
            }));
            alert.affectedAreas = transformedAreas;
        }

        if (remarks !== undefined) alert.remarks = remarks;

        await alert.save();

        logger.success('Alert updates successfully');

        res.status(200).json({
            success: true,
            message: 'Alert updated successfully',
            data: alert
        });
    } catch (error) {
        logger.error('Error updating alert:', error);

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

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid alert ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update alert',
            error: error.message
        });
    }
};

// @desc   Delete alert 
// @route  DELETE /api/alerts/:id
export const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        await alert.deleteOne();

        logger.success('Alert deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        logger.error('Erro deleting alert:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid alert ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete alert',
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