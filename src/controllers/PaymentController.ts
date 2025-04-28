import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { PaymentService } from '../services/PaymentService';
import { UserRole } from '@prisma/client';

export class PaymentController extends BaseController {
  private paymentService: PaymentService;

  constructor() {
    super();
    this.paymentService = new PaymentService();
  }

  public async initiatePayment(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { amount, currency, paymentMethod } = req.body;

      const payment = await this.paymentService.initiatePayment(
        amount,
        currency,
        paymentMethod,
        merchantId
      );

      this.sendResponse(res, payment, 201);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async authorizePayment(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { paymentId } = req.params;

      const payment = await this.paymentService.authorizePayment(paymentId);
      this.sendResponse(res, payment);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async capturePayment(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { paymentId } = req.params;

      const payment = await this.paymentService.capturePayment(paymentId);
      this.sendResponse(res, payment);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { paymentId } = req.params;

      const payment = await this.paymentService.cancelPayment(paymentId);
      this.sendResponse(res, payment);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async checkPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { paymentId } = req.params;

      const status = await this.paymentService.checkPaymentStatus(paymentId);
      this.sendResponse(res, { status });
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }
} 