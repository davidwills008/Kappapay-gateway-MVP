import { IsString, IsObject, IsEnum, IsOptional } from 'class-validator';
import { BaseEntity } from './BaseEntity';

export enum WebhookEventType {
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  PAYMENT_CAPTURED = 'PAYMENT_CAPTURED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_CREATED = 'REFUND_CREATED',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
  REFUND_FAILED = 'REFUND_FAILED'
}

export enum WebhookEventStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export class WebhookEvent extends BaseEntity {
  @IsEnum(WebhookEventType)
  type: WebhookEventType;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  endpoint: string;

  @IsEnum(WebhookEventStatus)
  status: WebhookEventStatus;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  constructor(
    id: string,
    type: WebhookEventType,
    payload: Record<string, any>,
    endpoint: string
  ) {
    super(id);
    this.type = type;
    this.payload = payload;
    this.endpoint = endpoint;
    this.status = WebhookEventStatus.PENDING;
  }

  public markAsDelivered(): void {
    this.status = WebhookEventStatus.DELIVERED;
    this.updateTimestamp();
  }

  public markAsFailed(errorMessage: string): void {
    this.status = WebhookEventStatus.FAILED;
    this.errorMessage = errorMessage;
    this.updateTimestamp();
  }
} 