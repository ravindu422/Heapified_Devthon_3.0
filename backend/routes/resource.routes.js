import { Router } from 'express';
const router = Router();
import { searchItem, getLowStockAlerts, getResourceStats, getDistributionCenters, getDistributionCenterById, createDistributionCenter, updateDistributionCenter, updateStock, deleteDistributionCenter } from '../controllers/resource.controller.js';

/**
 * @route   GET /api/resources/search/item
 * @desc    Search for specific item across all centers
 * @access  Public
 * @query   itemName (required), minStock (optional), latitude (optional), longitude (optional)
 */
router.get('/search/item', searchItem);

/**
 * @route   GET /api/resources/alerts
 * @desc    Get all low stock alerts
 * @access  Public
 * @query   severity (optional), isActive (optional)
 */
router.get('/alerts', getLowStockAlerts);

/**
 * @route   GET /api/resources/stats
 * @desc    Get resource statistics
 * @access  Public
 */
router.get('/stats', getResourceStats);

/**
 * @route   GET /api/resources
 * @desc    Get all distribution centers with filters
 * @access  Public
 * @query   latitude, longitude, maxDistance, type, status, category, district, province, hasStock, sortBy, page, limit
 */
router.get('/', getDistributionCenters);

/**
 * @route   GET /api/resources/:id
 * @desc    Get single distribution center by ID
 * @access  Public
 * @query   latitude (optional), longitude (optional)
 */
router.get('/:id', getDistributionCenterById);

/**
 * @route   POST /api/resources
 * @desc    Create new distribution center
 * @access  Private/Admin
 */
router.post('/', createDistributionCenter);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update distribution center
 * @access  Private/Admin
 */
router.put('/:id', updateDistributionCenter);

/**
 * @route   PATCH /api/resources/:id/stock
 * @desc    Update stock item
 * @access  Private/Coordinator
 */
router.patch('/:id/stock', updateStock);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete distribution center (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', deleteDistributionCenter);

export default router;