import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ValidationMiddleware extends BaseMiddleware {
  public validateRequest(schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToClass(schema, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
          const errorMessages = errors.map((error) => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join(', ');
          });

          res.status(400).json({
            error: 'Validation Error',
            message: errorMessages.join('; '),
          });
          return;
        }

        req.body = dto;
        next();
      } catch (error) {
        this.handleError(error as Error, req, res, next);
      }
    };
  }

  public validateParams(schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToClass(schema, req.params);
        const errors = await validate(dto);

        if (errors.length > 0) {
          const errorMessages = errors.map((error) => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join(', ');
          });

          res.status(400).json({
            error: 'Validation Error',
            message: errorMessages.join('; '),
          });
          return;
        }

        req.params = dto;
        next();
      } catch (error) {
        this.handleError(error as Error, req, res, next);
      }
    };
  }

  public validateQuery(schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToClass(schema, req.query);
        const errors = await validate(dto);

        if (errors.length > 0) {
          const errorMessages = errors.map((error) => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join(', ');
          });

          res.status(400).json({
            error: 'Validation Error',
            message: errorMessages.join('; '),
          });
          return;
        }

        req.query = dto;
        next();
      } catch (error) {
        this.handleError(error as Error, req, res, next);
      }
    };
  }
} 