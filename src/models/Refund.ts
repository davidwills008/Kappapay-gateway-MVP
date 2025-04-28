import { IsDecimal, IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { RefundStatus } from '@prisma/client';

export class Refund extends BaseEntity {
  @IsUUID()
  paymentId: string;

  @IsDecimal()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(RefundStatus)
  status: RefundStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  constructor(
    id: string,
    paymentId: string,
    amount: number,
    currency: string,
    reason?: string
  ) {
    super(id);
    this.paymentId = paymentId;
    this.amount = amount;
    this.currency = currency;
    this.status = RefundStatus.PENDING;
    this.reason = reason;
  }

  public complete(): void {
    this.status = RefundStatus.COMPLETED;
    this.updateTimestamp();
  }

  public fail(): void {
    this.status = RefundStatus.FAILED;
    this.updateTimestamp();
  }
} 