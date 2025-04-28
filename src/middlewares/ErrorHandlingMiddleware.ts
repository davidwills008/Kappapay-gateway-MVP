import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';

export class ErrorHandlingMiddleware extends BaseMiddleware {
  public handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Validation Error',
        message: error.message,
      });
      return;
    }

    if (error.name === 'UnauthorizedError') {
      res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
      return;
    }

    if (error.name === 'ForbiddenError') {
      res.status(403).json({
        error: 'Forbidden',
        message: error.message,
      });
      return;
    }

    if (error.name === 'NotFoundError') {
      res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }

  public handle404(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  }

  public handleAsyncError(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
} 