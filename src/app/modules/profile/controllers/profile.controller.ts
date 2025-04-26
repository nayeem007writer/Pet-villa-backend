import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { ImageFilter, storageImageOptions, storageOptions } from '@src/shared';

import { AuthUser } from '@src/app/decorators';
import { ProfileService } from '../services/profile.service';
import { User } from '../../user/entities/user.entity';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  RELATIONS = [];
  constructor(private readonly service: ProfileService) { }

  // user can see only his own products
  // admin can see all products
  @Get()
  async findone(
    @AuthUser() AuthUser,
  ): Promise<SuccessResponse | User> {
    return await this.service.findUser(AuthUser.id);
  }


}
