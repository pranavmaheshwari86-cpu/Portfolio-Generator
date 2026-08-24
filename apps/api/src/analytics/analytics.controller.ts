import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post(':portfolioId/hit')
  async recordHit(
    @Param('portfolioId') portfolioId: string,
    @Body() body: { device?: 'desktop' | 'mobile' | 'tablet'; referrer?: string }
  ) {
    return this.analyticsService.recordVisit(
      portfolioId,
      body.device || 'desktop',
      body.referrer
    );
  }

  @Get(':portfolioId')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Param('portfolioId') portfolioId: string) {
    return this.analyticsService.getPortfolioAnalytics(portfolioId);
  }
}
