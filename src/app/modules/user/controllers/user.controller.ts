import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FilterRoleDTO } from '../../acl/dtos';
import { Role } from '../../acl/entities/role.entity';
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AvatarDTO } from '../dtos/user/avatar.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageFilter, storageImageOptions } from '@src/shared/common.utils';
import { ENV } from '@src/env';
import { AuthUser } from '@src/app/decorators';
import { ENUM_ACL_DEFAULT_ROLES } from '@src/shared';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  RELATIONS = ['userRoles', 'userRoles.role'];
  constructor(private readonly service: UserService) {}

  @Get()
  async findAll(
    @Query() query: FilterUserDTO
  ): Promise<SuccessResponse | User[]> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id/available-roles')
  async availableRoles(
    @Param('id') id: string,
    @Query() query: FilterRoleDTO
  ): Promise<Role[]> {
    return this.service.availableRoles(id, query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

    @Patch('avatar')
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: AvatarDTO })
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          // { name: "thumbImage", maxCount: 1 },
          { name: "productImages", maxCount: 1 },
          // { name: "productVideo", maxCount: 1 },
        ],
        {
          storage: storageImageOptions,
          fileFilter: ImageFilter,
          limits: { fileSize: ENV.files.IMAGE_MAX_SIZE },
        })
    )
    uploadAvatar(    
        @UploadedFiles() files,
        @Body() data: AvatarDTO,
        @Req() request,
        @AuthUser() authUser,):Promise<SuccessResponse | User> {

              if (request.fileValidationError) {
                throw new BadRequestException(request.fileValidationError);
              }
              return this.service.createProductsWithImageWithSpecialProduct(
                data, files, authUser);
    }


    @Patch(':id/activate')
    async activeUser(
      @Param('id') id: string,
    ): Promise<SuccessResponse | User> {
      const body = {
        isActive: true,
      };
      return this.service.updateOneBase(id, body,);

    }


  @Post()
  async createOne(@Body() body: CreateUserDTO): Promise<User> {
    return this.service.createUser(body, this.RELATIONS);
  }

  //   @Post('recover/:id')
  //   async recoverById(@Param('id') id: string): Promise<User> {
  //     return this.service.recoverByIdBase(id);
  //   }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO
  ): Promise<User> {
    return this.service.updateUser(id, body, this.RELATIONS);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    const user = await this.service.findByIdBase(id);
    let  isSuperAdmin = user.roles.map((role) => role.title).includes(ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN);
    if (isSuperAdmin) {
      throw new BadRequestException('You cannot delete super-admin');
    }
    return this.service.deleteOneBase(id);
  }

  //   @Delete('soft/:id')
  //   async softDeleteOne(@Param('id') id: string): Promise<SuccessResponse> {
  //     return this.service.softDeleteOneBase(id);
  //   }
}
