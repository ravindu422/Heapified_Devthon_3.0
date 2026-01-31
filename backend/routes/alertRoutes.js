import express from 'express';
import { createAlert, getRecentAlerts } from '../controllers/alertController.js';
import { createAlertValidation, validate } from '../validators/alertValidator.js';

const router = express.Router();

router.get('/recent', getRecentAlerts);

// Protected routes
router.post('/', createAlertValidation, validate,createAlert);

export default router;