const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');

/**
 * @route   GET /api/resources/search/item
 * @desc    Search for specific item across all centers
 * @access  Public
 * @query   itemName (required), minStock (optional), latitude (optional), longitude (optional)
 */
router.get('/search/item', resourceController.searchItem);

/**
 * @route   GET /api/resources/alerts
 * @desc    Get all low stock alerts
 * @access  Public
 * @query   severity (optional), isActive (optional)
 */
router.get('/alerts', resourceController.getLowStockAlerts);

/**
 * @route   GET /api/resources/stats
 * @desc    Get resource statistics
 * @access  Public
 */
router.get('/stats', resourceController.getResourceStats);

/**
 * @route   GET /api/resources
 * @desc    Get all distribution centers with filters
 * @access  Public
 * @query   latitude, longitude, maxDistance, type, status, category, district, province, hasStock, sortBy, page, limit
 */
router.get('/', resourceController.getDistributionCenters);

/**
 * @route   GET /api/resources/:id
 * @desc    Get single distribution center by ID
 * @access  Public
 * @query   latitude (optional), longitude (optional)
 */
router.get('/:id', resourceController.getDistributionCenterById);

/**
 * @route   POST /api/resources
 * @desc    Create new distribution center
 * @access  Private/Admin
 */
router.post('/', resourceController.createDistributionCenter);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update distribution center
 * @access  Private/Admin
 */
router.put('/:id', resourceController.updateDistributionCenter);

/**
 * @route   PATCH /api/resources/:id/stock
 * @desc    Update stock item
 * @access  Private/Coordinator
 */
router.patch('/:id/stock', resourceController.updateStock);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete distribution center (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', resourceController.deleteDistributionCenter);

module.exports = router;