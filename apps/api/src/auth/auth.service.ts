import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getDatabase, users } from '@portfolio-ai/database';
import { eq } from 'drizzle-orm';
import type { RegisterInput, LoginInput } from '@portfolio-ai/schemas';
import { MemoryStore } from '../common/memory-store.js';

@Injectable()
export class AuthService {
  private db = getDatabase();

  constructor(private jwtService: JwtService) {}

  async register(data: RegisterInput) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    const emailLower = data.email.toLowerCase();

    try {
      const existing = await this.db.select().from(users).where(eq(users.email, emailLower)).limit(1);
      if (existing.length > 0) {
        throw new ConflictException('User with this email already exists');
      }

      const [newUser] = await this.db.insert(users).values({
        email: emailLower,
        passwordHash,
        name: data.name,
        profession: data.profession || null,
      }).returning();

      const token = await this.generateToken(newUser.id, newUser.email, newUser.name, newUser.role);
      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          profession: newUser.profession,
          role: newUser.role,
          plan: newUser.plan,
        },
        token,
      };
    } catch (err: unknown) {
      if (err instanceof ConflictException) throw err;
      // In-memory fallback
      for (const u of MemoryStore.users.values()) {
        if (u.email === emailLower) throw new ConflictException('User with this email already exists');
      }

      const mockId = `usr-${Date.now().toString(36)}`;
      const newUser = {
        id: mockId,
        email: emailLower,
        passwordHash,
        name: data.name,
        profession: data.profession || null,
        role: 'USER',
        plan: 'FREE',
      };
      MemoryStore.users.set(mockId, newUser);

      const token = await this.generateToken(newUser.id, newUser.email, newUser.name, newUser.role);
      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          profession: newUser.profession,
          role: newUser.role,
          plan: newUser.plan,
        },
        token,
      };
    }
  }

  async login(data: LoginInput) {
    const emailLower = data.email.toLowerCase();

    try {
      const [user] = await this.db.select().from(users).where(eq(users.email, emailLower)).limit(1);
      if (user && user.passwordHash) {
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Invalid email or password');

        const token = await this.generateToken(user.id, user.email, user.name, user.role);
        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profession: user.profession,
            role: user.role,
            plan: user.plan,
          },
          token,
        };
      }
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) throw err;
    }

    // In-memory fallback
    for (const user of MemoryStore.users.values()) {
      if (user.email === emailLower) {
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Invalid email or password');

        const token = await this.generateToken(user.id, user.email, user.name, user.role);
        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profession: user.profession,
            role: user.role,
            plan: user.plan,
          },
          token,
        };
      }
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  private async generateToken(id: string, email: string, name: string, role: string) {
    return this.jwtService.signAsync({ id, email, name, role });
  }
}
