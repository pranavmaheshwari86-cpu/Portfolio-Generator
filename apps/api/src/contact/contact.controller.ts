import { Controller, Post, Body, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ContactService, type SubmitContactDto } from './contact.service.js';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitContactForm(@Body() body: SubmitContactDto, @Req() req: Request) {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    return this.contactService.handleContactSubmission(body, clientIp);
  }

  @Post(':portfolioId')
  async submitPortfolioContactForm(
    @Param('portfolioId') portfolioId: string,
    @Body() body: SubmitContactDto,
    @Req() req: Request
  ) {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    return this.contactService.handleContactSubmission({ ...body, portfolioId }, clientIp);
  }
}
