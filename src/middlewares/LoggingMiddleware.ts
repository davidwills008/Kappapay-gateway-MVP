import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';

export class LoggingMiddleware extends BaseMiddleware {
  public logRequest(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      process.stdout.write(`${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}\n`);
    });

    next();
  }

  public logError(error: Error, req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    process.stderr.write(`Error in ${method} ${originalUrl} - ${ip}: ${error.message}\n`);
    next(error);
  }

  public logResponse(req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;
    res.send = function (body: unknown): Response {
      process.stdout.write(`Response body: ${JSON.stringify(body)}\n`);
      return originalSend.call(this, body);
    };
    next();
  }
} 