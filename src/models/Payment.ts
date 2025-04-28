import { IsString, IsNumber, IsDate, IsIn } from 'class-validator';
import { BaseEntity } from './BaseEntity';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'cancelled' | 'refunded';

export class Payment extends BaseEntity {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  payerId: string;

  @IsString()
  payeeId: string;

  @IsIn(['pending', 'authorized', 'captured', 'cancelled', 'refunded'])
  status: PaymentStatus;

  constructor(
    id: string,
    amount: number,
    currency: string,
    payerId: string,
    payeeId: string,
    status: PaymentStatus = 'pending'
  ) {
    super(id);
    this.amount = amount;
    this.currency = currency;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.status = status;
  }

  public updateStatus(newStatus: PaymentStatus): void {
    this.status = newStatus;
    this.updateTimestamp();
  }

  public isRefundable(): boolean {
    return this.status === 'captured';
  }

  public isCancellable(): boolean {
    return this.status === 'pending' || this.status === 'authorized';
  }
} 