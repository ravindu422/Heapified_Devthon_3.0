import { body, validationResult } from 'express-validator';

export const createAlertValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Alert title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Alert message is required')
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),

    body('alertType')
        .notEmpty()
        .withMessage('Alert type is required')
        .isIn(['Flood', 'Landslide', 'Other']),

    body('severityLevel')
        .notEmpty()
        .withMessage('Severity level is required')
        .isIn(['Critical', 'High', 'Medium', 'Low']),

    body('affectedAreas')
        .isArray({ min: 1 })
        .withMessage('At least one affected area is required'),

    body('affectedAreas.*.name')
        .trim()
        .notEmpty()
        .withMessage('Area name is required'),
    
    body('affectedAreas.*.displayName')
        .optional()
        .trim(),
    
    body('affectedAreas.*.geometry')
        .notEmpty()
        .withMessage('Area geometry is required'),
    
    body('affectedAreas.*.geometry.type')
        .isIn(['Point', 'Polygon', 'MultiPolygon', 'LineString'])
        .withMessage('Invalid geometry type'),
    
    body('affectedAreas.*.geometry.coordinates')
        .notEmpty()
        .withMessage('Geometry coordinates are required'),
    
    body('affectedAreas.*.coordinates.latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Invalid latitude'),
    
    body('affectedAreas.*.coordinates.longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Invalid longitude'),
    
    body('affectedAreas.*.boundingBox')
        .optional()
        .isArray()
        .withMessage('Bounding box must be an array'),
    
    body('remarks')
        .optional()       
        .trim()
        .isLength({ max: 500 })
        .withMessage('Remarks cannot be exceed 500 characters')
];

export const updateAlertValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Titile cannot exceed 200 characters'),
    
    body('message')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),
    
    body('alertType')
        .optional()
        .isIn(['Flood', 'Landslide', 'Other']),

    body('severityLevel')
        .optional()
        .isIn(['Critical', 'High', 'Medium', 'Low']),

    body('affectedAreas')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one affected area is required when updating'),
    
    body('affectedAreas.*.name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Area name is required'),
    
    body('affectedAreas.*.displayName')
        .optional()
        .trim(),
    
    body('affectedAreas.*.geometry')
        .optional()
        .notEmpty()
        .withMessage('Area geometry is required'),
    
    body('affectedAreas.*.geometry.type')
        .optional()
        .isIn(['Point', 'Polygon', 'MultiPolygon', 'LineString'])
        .withMessage('Invalid geometry type'),
    
    body('affectedAreas.*.coordinates.latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Invalid latitude'),

    body('affectedAreas.*.coordinates.longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Invalid longitude'),

    body('remarks')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Remarks cannot exceed 500 characters')
];


//Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }

    next();
}