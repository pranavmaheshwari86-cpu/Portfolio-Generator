import { Module } from '@nestjs/common';
import { GenerationsController } from './generations.controller.js';
import { GenerationsService } from './generations.service.js';
import { AiModule } from '../ai/ai.module.js';
import { ProfilesModule } from '../profiles/profiles.module.js';
import { PortfoliosModule } from '../portfolios/portfolios.module.js';

@Module({
  imports: [AiModule, ProfilesModule, PortfoliosModule],
  controllers: [GenerationsController],
  providers: [GenerationsService],
  exports: [GenerationsService],
})
export class GenerationsModule {}
