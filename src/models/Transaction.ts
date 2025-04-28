import { IsDecimal, IsString, IsEnum, IsUUID } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { TransactionStatus, TransactionType } from '@prisma/client';

export class Transaction extends BaseEntity {
  @IsUUID()
  paymentId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsDecimal()
  amount: number;

  @IsString()
  currency: string;

  @IsUUID()
  merchantId: string;

  constructor(
    id: string,
    paymentId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    merchantId: string
  ) {
    super(id);
    this.paymentId = paymentId;
    this.type = type;
    this.status = TransactionStatus.PENDING;
    this.amount = amount;
    this.currency = currency;
    this.merchantId = merchantId;
  }

  public complete(): void {
    this.status = TransactionStatus.COMPLETED;
    this.updateTimestamp();
  }

  public fail(): void {
    this.status = TransactionStatus.FAILED;
    this.updateTimestamp();
  }

  public reverse(): void {
    this.status = TransactionStatus.REVERSED;
    this.updateTimestamp();
  }
} 