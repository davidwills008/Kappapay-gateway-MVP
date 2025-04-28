import { PrismaClient, TransactionType, TransactionStatus } from '@prisma/client';
import { BaseService } from './BaseService';
import { Transaction } from '../models/Transaction';

export class TransactionService extends BaseService<Transaction> {
  public async recordTransaction(
    id: string,
    paymentId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    merchantId: string
  ): Promise<Transaction> {
    try {
      const transaction = new Transaction(
        id,
        paymentId,
        type,
        amount,
        currency,
        merchantId
      );

      await this.validateEntity(transaction);

      const createdTransaction = await this.prisma.transaction.create({
        data: {
          id: transaction.id,
          paymentId,
          type,
          status: transaction.status,
          amount,
          currency,
          merchantId,
        },
      });

      return new Transaction(
        createdTransaction.id,
        createdTransaction.paymentId,
        createdTransaction.type,
        Number(createdTransaction.amount),
        createdTransaction.currency,
        createdTransaction.merchantId
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async updateTransactionStatus(
    paymentId: string,
    status: TransactionStatus
  ): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { paymentId },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status },
      });

      return new Transaction(
        updatedTransaction.id,
        updatedTransaction.paymentId,
        updatedTransaction.type,
        Number(updatedTransaction.amount),
        updatedTransaction.currency,
        updatedTransaction.merchantId
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async getTransactionByPaymentId(
    paymentId: string
  ): Promise<Transaction | null> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { paymentId },
      });

      if (!transaction) {
        return null;
      }

      return new Transaction(
        transaction.id,
        transaction.paymentId,
        transaction.type,
        Number(transaction.amount),
        transaction.currency,
        transaction.merchantId
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }
} 