import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { WebhookService } from '../services/WebhookService';
import { WebhookEventType } from '../models/WebhookEvent';

export class WebhookController extends BaseController {
  private webhookService: WebhookService;

  constructor() {
    super();
    this.webhookService = new WebhookService();
  }

  public async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = await this.authenticateRequest(req);

      const { type, payload, endpoint } = req.body;

      if (!Object.values(WebhookEventType).includes(type)) {
        throw new Error('Invalid webhook event type');
      }

      const webhookEvent = await this.webhookService.sendNotification(
        type as WebhookEventType,
        payload,
        endpoint
      );

      this.sendResponse(res, webhookEvent, 201);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  public async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { payload } = req.body;

      const webhookEvent = await this.webhookService.handleWebhookEvent(
        eventId,
        payload
      );

      this.sendResponse(res, webhookEvent);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }
} 