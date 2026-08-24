import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service.js';
import { JwtAuthGuard, type AuthenticatedUser } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per TRD
    })
  )
  async uploadResume(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a valid resume file');
    }
    return this.resumesService.processResumeUpload(user.id, file);
  }

  @Get()
  async getResumes(@CurrentUser() user: AuthenticatedUser) {
    return this.resumesService.getUserResumes(user.id);
  }

  @Get(':id')
  async getResume(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.resumesService.getResumeById(user.id, id);
  }
}
