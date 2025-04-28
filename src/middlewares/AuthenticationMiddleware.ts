import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';
import { UserRole } from '@prisma/client';

export class AuthenticationMiddleware extends BaseMiddleware {
  public async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.authenticateRequest(req);
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: (error as Error).message,
      });
    }
  }

  public async requireMerchant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isAuthorized = await this.authorizeRequest(req, UserRole.MERCHANT);
      if (!isAuthorized) {
        throw new Error('Merchant role required');
      }
      next();
    } catch (error) {
      res.status(403).json({
        error: 'Forbidden',
        message: (error as Error).message,
      });
    }
  }

  public async requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isAuthorized = await this.authorizeRequest(req, UserRole.ADMIN);
      if (!isAuthorized) {
        throw new Error('Admin role required');
      }
      next();
    } catch (error) {
      res.status(403).json({
        error: 'Forbidden',
        message: (error as Error).message,
      });
    }
  }
} 