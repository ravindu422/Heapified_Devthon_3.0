import express from 'express';
import resourcesController from '../controllers/resources.controller.js';

const router = express.Router();

// List with filters/sorting
router.get('/', resourcesController.getResources);

// Stats and alerts
router.get('/stats', resourcesController.getStats);
router.get('/alerts', resourcesController.getAlerts);

// Search
router.get('/search/item', resourcesController.searchItem);

// Details
router.get('/:id', resourcesController.getResourceById);

export default router;
