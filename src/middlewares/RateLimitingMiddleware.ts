import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export class RateLimitingMiddleware extends BaseMiddleware {
  private requestCounts: Map<string, { count: number; resetTime: number }>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    super();
    this.requestCounts = new Map();
    this.config = config;
  }

  public limitRequests(req: Request, res: Response, next: NextFunction): void {
    const clientIp = req.ip;
    const now = Date.now();

    if (!this.requestCounts.has(clientIp)) {
      this.requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      next();
      return;
    }

    const clientData = this.requestCounts.get(clientIp)!;

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + this.config.windowMs;
      next();
      return;
    }

    if (clientData.count >= this.config.maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      });
      return;
    }

    clientData.count++;
    next();
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [ip, data] of this.requestCounts.entries()) {
      if (now > data.resetTime) {
        this.requestCounts.delete(ip);
      }
    }
  }
} 