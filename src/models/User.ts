import { IsString, IsEmail, IsEnum } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { UserRole } from '@prisma/client';

export class User extends BaseEntity {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  constructor(id: string, email: string, password: string, role: UserRole = UserRole.MERCHANT) {
    super(id);
    this.email = email;
    this.password = password;
    this.role = role;
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public isMerchant(): boolean {
    return this.role === UserRole.MERCHANT;
  }
} 