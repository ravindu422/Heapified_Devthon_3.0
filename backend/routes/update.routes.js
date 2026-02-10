import express from 'express';
import * as updateController from '../controllers/update.controller.js';

const router = express.Router();

/**
 * @route   GET /api/updates/critical/recent
 * @desc    Get recent critical updates
 * @access  Public
 * @query   limit (optional)
 */
router.get('/critical/recent', updateController.getRecentCritical);

/**
 * @route   GET /api/updates/filters/options
 * @desc    Get available filter options
 * @access  Public
 */
router.get('/filters/options', updateController.getFilterOptions);

/**
 * @route   GET /api/updates/stats
 * @desc    Get updates statistics
 * @access  Public
 */
router.get('/stats', updateController.getUpdateStats);

/**
 * @route   GET /api/updates/search
 * @desc    Search updates
 * @access  Public
 * @query   q (required)
 */
router.get('/search', updateController.searchUpdates);

/**
 * @route   GET /api/updates/location/:province
 * @desc    Get updates by location
 * @access  Public
 * @query   district (optional)
 */
router.get('/location/:province', updateController.getUpdatesByLocation);

/**
 * @route   GET /api/updates
 * @desc    Get all updates with filters
 * @access  Public
 * @query   severity, category, province, district, dateFrom, dateTo, tags, verified, isPinned, search, page, limit, sortBy, sortOrder
 */
router.get('/', updateController.getUpdates);

/**
 * @route   GET /api/updates/:id
 * @desc    Get single update by ID
 * @access  Public
 */
router.get('/:id', updateController.getUpdateById);

/**
 * @route   POST /api/updates
 * @desc    Create new update
 * @access  Private/Coordinator
 */
router.post('/', updateController.createUpdate);

/**
 * @route   PUT /api/updates/:id
 * @desc    Update an update
 * @access  Private/Coordinator
 */
router.put('/:id', updateController.updateUpdate);

/**
 * @route   DELETE /api/updates/:id
 * @desc    Delete update (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', updateController.deleteUpdate);

/**
 * @route   POST /api/updates/:id/share
 * @desc    Increment share count
 * @access  Public
 */
router.post('/:id/share', updateController.shareUpdate);

export default router;