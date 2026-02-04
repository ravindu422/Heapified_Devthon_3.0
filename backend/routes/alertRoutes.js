import express from 'express';
import { createAlert, deleteAlert, getAlert, getAlertById, getRecentAlerts, updateAlert } from '../controllers/alertController.js';
import { createAlertValidation, updateAlertValidation, validate } from '../validators/alertValidator.js';

const router = express.Router();

router.get('/recent', getRecentAlerts);
router.get('/:id', getAlertById);
router.get('/', getAlert);

// Protected routes
router.post('/', createAlertValidation, validate, createAlert);
router.put('/:id', updateAlertValidation, validate, updateAlert);
router.delete('/:id', deleteAlert);

export default router;