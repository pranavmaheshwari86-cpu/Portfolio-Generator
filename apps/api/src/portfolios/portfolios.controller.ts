import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service.js';
import { JwtAuthGuard, type AuthenticatedUser } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { portfolioSchema, type PortfolioSchema } from '@portfolio-ai/schemas';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPortfolio(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(portfolioSchema)) body: PortfolioSchema
  ) {
    return this.portfoliosService.createPortfolio(user.id, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyPortfolios(@CurrentUser() user: AuthenticatedUser) {
    return this.portfoliosService.getUserPortfolios(user.id);
  }

  @Get('public/:slug')
  async getPublicPortfolio(@Param('slug') slug: string) {
    return this.portfoliosService.getPortfolioBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPortfolioById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    return this.portfoliosService.getPortfolioById(user.id, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePortfolio(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(portfolioSchema)) body: PortfolioSchema
  ) {
    return this.portfoliosService.updatePortfolio(user.id, id, body);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishPortfolio(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    return this.portfoliosService.publishPortfolio(user.id, id);
  }

  @Get(':id/versions')
  @UseGuards(JwtAuthGuard)
  async getVersions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    return this.portfoliosService.getVersions(user.id, id);
  }
}
