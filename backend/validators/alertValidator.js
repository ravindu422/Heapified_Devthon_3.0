import { body, validationResult } from 'express-validator';

export const createAlertValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Alert title is required')
        .isLength({ max: 200 })
        .withMessage('Titile cannot exceed 200 characters'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Alert message is required')
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),

    body('severityLevel')
        .notEmpty()
        .withMessage('Severity level is required')
        .isIn(['Critical', 'High', 'Medium', 'Low']),

    body('affectedAreas')
        .trim()
        .notEmpty()
        .withMessage('Affected areas are required'),
    
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

    body('severityLevel')
        .optional()
        .isIn(['Critical', 'High', 'Medium', 'Low']),

    body('affectedAreas')
        .optional()
        .trim(),

    body('remarks')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Remarks cannot be exceed 500 characters')
];


//Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
}