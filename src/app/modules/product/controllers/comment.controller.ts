import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CommentService } from '../services/comment.service';
import { Comment } from '../entities/comment';
import { FilterCommentDTO } from '../dtos/comment/filter.dto';
import { CreateCommentDTO } from '../dtos/comment/create.dto';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  RELATIONS = ['product'];
  constructor(private readonly service: CommentService) { }

  // user can see only his own products
  // admin can see all products
  @Get(":id")
  async findOne(
    @AuthUser() AuthUser,
    @Param('id') id: string
  ): Promise<SuccessResponse | Comment> {
    return this.service.findByIdBase(id);
  }




  @Post(':id') 
  async createOne(
    @Body() body: CreateCommentDTO,
    @AuthUser() AuthUser,
    @Param('id') id: string
  ): Promise<SuccessResponse | Comment>  {
  return this.service.createComment(id, body, AuthUser.id);
}


}
