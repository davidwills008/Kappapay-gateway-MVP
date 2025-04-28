import { PrismaClient, UserRole } from '@prisma/client';
import { BaseService } from './BaseService';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService extends BaseService<User> {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    super();
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  }

  public async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      return this.generateToken(user.id, user.role);
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async authenticate(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as {
        userId: string;
        role: UserRole;
      };

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return new User(user.id, user.email, user.password, user.role);
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async authorizeAction(
    userId: string,
    requiredRole: UserRole
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Admin can do anything
      if (user.role === UserRole.ADMIN) {
        return true;
      }

      // Check if user's role matches the required role
      return user.role === requiredRole;
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async registerUser(
    email: string,
    password: string,
    role: UserRole = UserRole.MERCHANT
  ): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User(
        crypto.randomUUID(),
        email,
        hashedPassword,
        role
      );

      await this.validateEntity(user);

      const createdUser = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });

      return new User(
        createdUser.id,
        createdUser.email,
        createdUser.password,
        createdUser.role
      );
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private generateToken(userId: string, role: UserRole): string {
    return jwt.sign(
      { userId, role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }
} 