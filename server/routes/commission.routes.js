import express from 'express';
import * as commissionController from '../controllers/commission.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get user commissions
router.get('/', authenticate, commissionController.getCommissions);

// Get commission stats
router.get('/stats', authenticate, commissionController.getCommissionStats);

export default router;

