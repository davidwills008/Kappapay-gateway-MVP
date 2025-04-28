import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRole } from '@prisma/client';

export abstract class BaseMiddleware {
  protected authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  protected async authenticateRequest(req: Request): Promise<string> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const user = await this.authService.authenticate(token);
    return user.id;
  }

  protected async authorizeRequest(
    req: Request,
    requiredRole: UserRole
  ): Promise<boolean> {
    const userId = await this.authenticateRequest(req);
    return this.authService.authorizeAction(userId, requiredRole);
  }

  protected handleError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }

  protected abstract handle(req: Request, res: Response, next: NextFunction): void;

  public getMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.handle(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
} 