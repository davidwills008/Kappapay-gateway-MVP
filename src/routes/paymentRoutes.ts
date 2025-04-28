import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { validatePaymentRequest } from '../middlewares/validationMiddleware';

const router = Router();
const paymentController = new PaymentController();

// Create a new payment
router.post(
  '/payments',
  validatePaymentRequest,
  (req, res) => paymentController.initiate(req, res)
);

// Authorize a payment
router.post(
  '/payments/:id/authorize',
  (req, res) => paymentController.authorize(req, res)
);

// Capture a payment
router.post(
  '/payments/:id/capture',
  (req, res) => paymentController.capture(req, res)
);

// Cancel a payment
router.post(
  '/payments/:id/cancel',
  (req, res) => paymentController.cancel(req, res)
);

// Get payment details
router.get(
  '/payments/:id',
  (req, res) => paymentController.getPayment(req, res)
);

// Get all payments (with optional query parameters)
router.get(
  '/payments',
  (req, res) => paymentController.getPayments(req, res)
);

export default router; 