import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { AiModule } from './ai/ai.module.js';
import { PortfoliosModule } from './portfolios/portfolios.module.js';
import { GenerationsModule } from './generations/generations.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
  imports: [
    AuthModule,
    ResumesModule,
    ProfilesModule,
    AiModule,
    PortfoliosModule,
    GenerationsModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
