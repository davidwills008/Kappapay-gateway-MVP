import { IsUUID, IsDate } from 'class-validator';

export abstract class BaseEntity {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }
} 