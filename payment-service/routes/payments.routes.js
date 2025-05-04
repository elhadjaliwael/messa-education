import express from 'express';
import { 
  getPayments, 
  createPayment, 
  getPaymentById,
  getPaymentStatus,
  handleWebhook 
} from '../controllers/payments.controller.js';

const router = express.Router();

// Payment routes
router.get('/payments', getPayments);
router.get('/payments/:id', getPaymentById);
router.get('/payments/:id/status', getPaymentStatus);
router.post('/payments', createPayment);

// Webhook route
router.post('/webhook', handleWebhook);

export default router;