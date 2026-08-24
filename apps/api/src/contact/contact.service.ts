import { Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { PortfoliosService } from '../portfolios/portfolios.service.js';

export interface SubmitContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
  portfolioId?: string;
  recipientEmail?: string;
}

interface RateLimitRecord {
  timestamps: number[];
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private rateLimitMap = new Map<string, RateLimitRecord>();

  constructor(
    private readonly emailService: EmailService,
    private readonly portfoliosService: PortfoliosService
  ) {}

  async handleContactSubmission(dto: SubmitContactDto, clientIp = '127.0.0.1'): Promise<{ message: string; id?: string }> {
    this.logger.log(`[CONTACT] Request received from IP ${clientIp} for email ${dto.email}`);

    // 1. Validation & Sanitization
    const name = dto.name ? dto.name.trim() : '';
    const email = dto.email ? dto.email.trim().toLowerCase() : '';
    const subject = dto.subject ? dto.subject.trim() : undefined;
    const message = dto.message ? dto.message.trim() : '';

    if (!name || name.length < 1 || name.length > 100) {
      throw new BadRequestException('Name must be between 1 and 100 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      throw new BadRequestException('Please provide a valid email address');
    }

    if (subject && subject.length > 200) {
      throw new BadRequestException('Subject must not exceed 200 characters');
    }

    if (!message || message.length < 5 || message.length > 5000) {
      throw new BadRequestException('Message must be between 5 and 5000 characters');
    }

    // Check for email header injection attempts
    if (this.hasHeaderInjection(name) || this.hasHeaderInjection(email) || (subject && this.hasHeaderInjection(subject))) {
      this.logger.warn(`[CONTACT] Header injection attempt detected from IP ${clientIp}`);
      throw new BadRequestException('Invalid input detected');
    }

    // 2. Rate Limiting (5 requests per 10 minutes per IP/Email)
    const rateLimitKey = `${clientIp}:${email}`;
    this.enforceRateLimit(rateLimitKey);

    this.logger.log(`[CONTACT] Validation successful for ${email}`);

    // 3. Recipient Resolution
    let recipient = process.env.CONTACT_EMAIL;

    if (dto.recipientEmail && emailRegex.test(dto.recipientEmail)) {
      recipient = dto.recipientEmail;
    } else if (dto.portfolioId) {
      try {
        const portfolio = await this.portfoliosService.getPortfolioById('guest-user-session', dto.portfolioId);
        if (portfolio && portfolio.schemaData && portfolio.schemaData.sections) {
          const contactSec = portfolio.schemaData.sections.find((s) => s.type === 'contact');
          const secContent = contactSec?.content as { email?: string } | undefined;
          if (secContent?.email && emailRegex.test(secContent.email)) {
            recipient = secContent.email;
          }
        }
      } catch (err) {
        this.logger.warn(`[CONTACT] Could not resolve portfolio recipient for ID ${dto.portfolioId}: ${(err as Error).message}`);
      }
    }

    if (!recipient) {
      recipient = process.env.CONTACT_EMAIL || 'alexander@wright-ai.dev';
    }

    // 4. Dispatch Email
    const result = await this.emailService.sendContactEmail({
      name,
      email,
      subject,
      message,
      recipientEmail: recipient,
    });

    return {
      message: 'Message sent successfully',
      id: result.id,
    };
  }

  private hasHeaderInjection(val: string): boolean {
    return /[\r\n]/.test(val);
  }

  private enforceRateLimit(key: string): void {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 5;

    const record = this.rateLimitMap.get(key) || { timestamps: [] };
    // Filter timestamps within the current window
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      this.logger.warn(`[CONTACT] Rate limit exceeded for key ${key}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many contact requests. Please wait a few minutes before trying again.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    validTimestamps.push(now);
    this.rateLimitMap.set(key, { timestamps: validTimestamps });
  }
}
