import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { GenerationsService } from './generations.service.js';
import { JwtAuthGuard, type AuthenticatedUser } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { enhancePromptInputSchema, type EnhancePromptInput } from '@portfolio-ai/schemas';

@Controller('generations')
@UseGuards(JwtAuthGuard)
export class GenerationsController {
  constructor(private generationsService: GenerationsService) {}

  @Post('start')
  async startGeneration(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(enhancePromptInputSchema)) body: EnhancePromptInput
  ) {
    return this.generationsService.startFullGeneration(user.id, body);
  }

  @Get()
  async getMyGenerations(@CurrentUser() user: AuthenticatedUser) {
    return this.generationsService.getUserGenerations(user.id);
  }

  @Get(':id')
  async getGeneration(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    return this.generationsService.getGenerationById(user.id, id);
  }
}
