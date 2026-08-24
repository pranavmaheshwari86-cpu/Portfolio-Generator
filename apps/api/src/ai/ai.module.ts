import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { ApiAiService } from './ai.service.js';
import { ProfilesModule } from '../profiles/profiles.module.js';

@Module({
  imports: [ProfilesModule],
  controllers: [AiController],
  providers: [ApiAiService],
  exports: [ApiAiService],
})
export class AiModule {}
