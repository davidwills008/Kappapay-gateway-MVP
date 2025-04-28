import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { RefundService } from '../services/RefundService';
import { UserRole } from '@prisma/client';

export class RefundController extends BaseController {
  private refundService: RefundService;

  constructor() {
    super();
    this.refundService = new RefundService();
  }

  public async initiateRefund(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { paymentId } = req.params;
      const { amount, currency, reason } = req.body;

      const refund = await this.refundService.initiateRefund(
        paymentId,
        amount,
        currency,
        reason
      );

      this.sendResponse(res, refund, 201);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async processRefund(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);
      await this.authService.authorizeAction(merchantId, UserRole.MERCHANT);

      const { refundId } = req.params;

      const refund = await this.refundService.processRefund(refundId);
      this.sendResponse(res, refund);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }
} 