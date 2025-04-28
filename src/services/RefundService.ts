import { PrismaClient, RefundStatus, TransactionType, TransactionStatus } from '@prisma/client';
import { BaseService } from './BaseService';
import { Refund } from '../models/Refund';
import { PaymentService } from './PaymentService';
import { TransactionService } from './TransactionService';
import { v4 as uuidv4 } from 'uuid';

export class RefundService extends BaseService<Refund> {
  private paymentService: PaymentService;
  private transactionService: TransactionService;

  constructor() {
    super();
    this.paymentService = new PaymentService();
    this.transactionService = new TransactionService();
  }

  public async initiateRefund(
    paymentId: string,
    amount: number,
    currency: string,
    reason?: string
  ): Promise<Refund> {
    try {
      // Verify payment exists and is captured
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'CAPTURED') {
        throw new Error('Only captured payments can be refunded');
      }

      if (Number(payment.amount) < amount) {
        throw new Error('Refund amount cannot exceed payment amount');
      }

      const refundId = uuidv4();
      const refund = new Refund(
        refundId,
        paymentId,
        amount,
        currency,
        reason
      );

      await this.validateEntity(refund);

      const createdRefund = await this.prisma.refund.create({
        data: {
          id: refund.id,
          paymentId,
          amount,
          currency,
          status: refund.status,
          reason,
        },
      });

      // Create transaction record for refund
      await this.transactionService.recordTransaction(
        uuidv4(),
        paymentId,
        TransactionType.REFUND,
        amount,
        currency,
        payment.merchantId
      );

      return new Refund(
        createdRefund.id,
        createdRefund.paymentId,
        Number(createdRefund.amount),
        createdRefund.currency,
        createdRefund.reason || undefined
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async processRefund(refundId: string): Promise<Refund> {
    try {
      const refund = await this.prisma.refund.findUnique({
        where: { id: refundId },
      });

      if (!refund) {
        throw new Error('Refund not found');
      }

      if (refund.status !== 'PENDING') {
        throw new Error('Refund is not in pending status');
      }

      // Simulate refund processing with external processor
      const isProcessed = await this.simulateRefundProcessing(refund);

      if (!isProcessed) {
        await this.prisma.refund.update({
          where: { id: refundId },
          data: { status: RefundStatus.FAILED },
        });
        throw new Error('Refund processing failed');
      }

      const updatedRefund = await this.prisma.refund.update({
        where: { id: refundId },
        data: { status: RefundStatus.COMPLETED },
      });

      // Update transaction status
      await this.transactionService.updateTransactionStatus(
        refund.paymentId,
        TransactionStatus.COMPLETED
      );

      return new Refund(
        updatedRefund.id,
        updatedRefund.paymentId,
        Number(updatedRefund.amount),
        updatedRefund.currency,
        updatedRefund.reason || undefined
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private async simulateRefundProcessing(refund: any): Promise<boolean> {
    // Simulate external refund processor
    // In a real implementation, this would call an actual payment processor API
    return Math.random() > 0.1; // 90% success rate for simulation
  }
} 