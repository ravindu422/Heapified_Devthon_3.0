import { Router } from 'express';
const router = Router();
import { getNearestSafeZones, getAvailableAmenities, getSafeZoneTypes, getSafeZoneStats, getSafeZones, getSafeZoneById, createSafeZone, updateSafeZone, updateCapacity, deleteSafeZone } from '../controllers/safeZone.controller.js';

/**
 * @route   GET /api/safe-zones/nearest
 * @desc    Get nearest safe zones based on coordinates
 * @access  Public
 * @query   latitude, longitude, limit (optional), maxDistance (optional)
 */
router.get('/nearest', getNearestSafeZones);

/**
 * @route   GET /api/safe-zones/amenities/list
 * @desc    Get list of available amenities for filtering
 * @access  Public
 */
router.get('/amenities/list', getAvailableAmenities);

/**
 * @route   GET /api/safe-zones/types/list
 * @desc    Get list of safe zone types for filtering
 * @access  Public
 */
router.get('/types/list', getSafeZoneTypes);

/**
 * @route   GET /api/safe-zones/stats
 * @desc    Get safe zone statistics
 * @access  Public
 */
router.get('/stats', getSafeZoneStats);

/**
 * @route   GET /api/safe-zones
 * @desc    Get all safe zones with optional filters
 * @access  Public
 * @query   latitude, longitude, maxDistance, type, status, amenities, district, province, minCapacity, sortBy, page, limit
 */
router.get('/', getSafeZones);

/**
 * @route   GET /api/safe-zones/:id
 * @desc    Get single safe zone by ID
 * @access  Public
 * @query   latitude (optional), longitude (optional) - to calculate distance
 */
router.get('/:id', getSafeZoneById);

/**
 * @route   POST /api/safe-zones
 * @desc    Create new safe zone
 * @access  Private/Admin
 */
router.post('/', createSafeZone);

/**
 * @route   PUT /api/safe-zones/:id
 * @desc    Update safe zone
 * @access  Private/Admin
 */
router.put('/:id', updateSafeZone);

/**
 * @route   PATCH /api/safe-zones/:id/capacity
 * @desc    Update safe zone capacity
 * @access  Private/Coordinator
 */
router.patch('/:id/capacity', updateCapacity);

/**
 * @route   DELETE /api/safe-zones/:id
 * @desc    Delete safe zone (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', deleteSafeZone);

export default router;