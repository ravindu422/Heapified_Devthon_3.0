import express from 'express';
import { searchLocations } from '../services/locationService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc  Search locations
// @route GET /api/locations/search?q=query
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters'
            });
        }

        const locations = await searchLocations(q.trim());

        res.status(200).json({
            success: true,
            data: locations
        });
    } catch (error) {
        logger.error('Location search error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to search locations'
        });
    }
});

export default router;