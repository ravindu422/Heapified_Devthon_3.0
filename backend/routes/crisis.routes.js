import express from 'express';
import crisisController from '../controllers/crisis.controller.js';

const router = express.Router();

// GET /api/crisis/overview
router.get('/overview', crisisController.getCrisisOverview);

// GET /api/crisis/:id
router.get('/:id', crisisController.getCrisisById);

export default router;