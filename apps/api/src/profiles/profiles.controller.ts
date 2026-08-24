import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { JwtAuthGuard, type AuthenticatedUser } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { professionalProfileSchema, type ProfessionalProfileInput } from '@portfolio-ai/schemas';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profilesService.getProfileByUserId(user.id);
  }

  @Put('me')
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(professionalProfileSchema)) body: ProfessionalProfileInput
  ) {
    return this.profilesService.updateProfile(user.id, body);
  }
}
