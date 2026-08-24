import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync<AuthenticatedUser>(token, {
          secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
        });
        (request as Request & { user: AuthenticatedUser }).user = payload;
        return true;
      } catch {
        // Fallback to guest user on token expiration/mismatch
      }
    }

    // Default guest session so onboarding, uploading, and generation work without friction
    (request as Request & { user: AuthenticatedUser }).user = {
      id: 'guest-user-session',
      email: 'guest@portfolio.ai',
      name: 'Guest Candidate',
      role: 'USER',
    };

    return true;
  }
}
