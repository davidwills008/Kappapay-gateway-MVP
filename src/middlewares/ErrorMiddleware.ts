import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';

export class ErrorMiddleware extends BaseMiddleware {
  public handleErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(error);

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

    if (error.name === 'ConflictError') {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }

  public handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
    });
  }

  public handleMethodNotAllowed(req: Request, res: Response): void {
    res.status(405).json({
      error: 'Method Not Allowed',
      message: `Method ${req.method} not allowed on ${req.originalUrl}`,
    });
  }
} 