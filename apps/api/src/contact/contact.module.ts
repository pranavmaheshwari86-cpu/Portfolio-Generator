import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller.js';
import { ContactService } from './contact.service.js';
import { EmailService } from './email.service.js';
import { PortfoliosModule } from '../portfolios/portfolios.module.js';

@Module({
  imports: [PortfoliosModule],
  controllers: [ContactController],
  providers: [ContactService, EmailService],
  exports: [ContactService, EmailService],
})
export class ContactModule {}
