import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export abstract class BaseController {
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

  protected handleError(res: Response, error: Error): void {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }

  protected validateRequest(req: Request, res: Response, schema: unknown): boolean {
    // TODO: Implement request validation using class-validator
    return true;
  }

  protected sendResponse(
    res: Response,
    data: any,
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
    });
  }

  protected sendSuccess(res: Response, data: unknown, statusCode = 200): void {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  protected sendError(res: Response, message: string, statusCode = 400): void {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  }
} 