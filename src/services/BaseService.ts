import { PrismaClient } from '@prisma/client';
import { BaseEntity } from '../models/BaseEntity';

export abstract class BaseService<T extends BaseEntity> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  protected async validateEntity(entity: T): Promise<void> {
    // TODO: Implement validation logic using class-validator
    // This will be implemented when we set up the validation middleware
  }

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error) {
      throw new Error(`Service error: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 