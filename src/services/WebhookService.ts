import { PrismaClient } from '@prisma/client';
import { BaseService } from './BaseService';
import { WebhookEvent, WebhookEventType, WebhookEventStatus } from '../models/WebhookEvent';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export class WebhookService extends BaseService<WebhookEvent> {
  public async sendNotification(
    type: WebhookEventType,
    payload: Record<string, any>,
    endpoint: string
  ): Promise<WebhookEvent> {
    try {
      const webhookEvent = new WebhookEvent(
        uuidv4(),
        type,
        payload,
        endpoint
      );

      await this.validateEntity(webhookEvent);

      const createdEvent = await this.prisma.webhookEvent.create({
        data: {
          id: webhookEvent.id,
          type,
          payload,
          endpoint,
          status: webhookEvent.status,
        },
      });

      // Send webhook asynchronously
      this.sendWebhook(createdEvent);

      return new WebhookEvent(
        createdEvent.id,
        createdEvent.type as WebhookEventType,
        createdEvent.payload,
        createdEvent.endpoint
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async handleWebhookEvent(
    eventId: string,
    payload: Record<string, any>
  ): Promise<WebhookEvent> {
    try {
      const event = await this.prisma.webhookEvent.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error('Webhook event not found');
      }

      // Process the webhook event based on its type
      await this.processWebhookEvent(event.type as WebhookEventType, payload);

      const updatedEvent = await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: { status: WebhookEventStatus.DELIVERED },
      });

      return new WebhookEvent(
        updatedEvent.id,
        updatedEvent.type as WebhookEventType,
        updatedEvent.payload,
        updatedEvent.endpoint
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private async sendWebhook(event: any): Promise<void> {
    try {
      const response = await axios.post(event.endpoint, {
        event: event.type,
        payload: event.payload,
        timestamp: new Date().toISOString(),
      });

      if (response.status >= 200 && response.status < 300) {
        await this.prisma.webhookEvent.update({
          where: { id: event.id },
          data: { status: WebhookEventStatus.DELIVERED },
        });
      } else {
        throw new Error(`Webhook delivery failed with status ${response.status}`);
      }
    } catch (error) {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          status: WebhookEventStatus.FAILED,
          errorMessage: (error as Error).message,
        },
      });
    }
  }

  private async processWebhookEvent(
    type: WebhookEventType,
    payload: Record<string, any>
  ): Promise<void> {
    // Process different types of webhook events
    switch (type) {
      case WebhookEventType.PAYMENT_CREATED:
        // Handle payment created event
        break;
      case WebhookEventType.PAYMENT_AUTHORIZED:
        // Handle payment authorized event
        break;
      case WebhookEventType.PAYMENT_CAPTURED:
        // Handle payment captured event
        break;
      case WebhookEventType.PAYMENT_CANCELLED:
        // Handle payment cancelled event
        break;
      case WebhookEventType.PAYMENT_FAILED:
        // Handle payment failed event
        break;
      case WebhookEventType.REFUND_CREATED:
        // Handle refund created event
        break;
      case WebhookEventType.REFUND_COMPLETED:
        // Handle refund completed event
        break;
      case WebhookEventType.REFUND_FAILED:
        // Handle refund failed event
        break;
      default:
        throw new Error(`Unknown webhook event type: ${type}`);
    }
  }
} 