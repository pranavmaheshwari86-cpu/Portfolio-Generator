import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiAiService } from './ai.service.js';
import { JwtAuthGuard, type AuthenticatedUser } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import {
  enhancePromptInputSchema,
  type EnhancePromptInput,
  type PortfolioSchema,
} from '@portfolio-ai/schemas';
import { ProfilesService } from '../profiles/profiles.service.js';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private aiService: ApiAiService,
    private profilesService: ProfilesService
  ) {}

  @Post('enhance-prompt')
  async enhancePrompt(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(enhancePromptInputSchema)) body: EnhancePromptInput
  ) {
    let profileData;
    try {
      const profile = await this.profilesService.getProfileByUserId(user.id);
      profileData = profile.profileData;
    } catch {
      profileData = undefined;
    }

    return this.aiService.enhancePrompt(body, profileData);
  }

  @Post('edit-patch')
  async editPatch(
    @Body() body: { portfolio: PortfolioSchema; instruction: string }
  ) {
    return this.aiService.applyAIEditorPatch(body.portfolio, body.instruction);
  }
}
