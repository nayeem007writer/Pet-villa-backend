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
import { CreateProductDTO, FilterProductDTO, UpdateProductDTO } from '../dtos';
import { Product } from '../entities/product.entity';
import { PanelProductService } from '../services/product.panel.service';
import { AuthUser } from '@src/app/decorators';

@ApiTags('Panel Pet')
@ApiBearerAuth()
@Controller('pets')
export class PanelProductController {
  RELATIONS = [];
  constructor(private readonly service: PanelProductService) { }

  @Get()
  async findAll(
    @Query() query: FilterProductDTO,
    @AuthUser() AuthUser,
  ): Promise<SuccessResponse | Product[]> {
    return this.service.findAllBaseById(AuthUser.id,query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateProductDTO })
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
  async createOne(
    @UploadedFiles() files,
    @Body() data: CreateProductDTO,
    @Req() request,
    @AuthUser() authUser,
  ): Promise<any> {

    console.log(data)

    if (request.fileValidationError) {
      throw new BadRequestException(request.fileValidationError);
    }
    return this.service.createProductsWithImageWithSpecialProduct(data, files, authUser);
  }

  @Put(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateProductDTO })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image", maxCount: 1 },
    ], {
      storage: storageOptions,
      fileFilter: ImageFilter,
      limits: { fileSize: ENV.files.IMAGE_MAX_SIZE },
    })
  )
  async updateOne(
    @Param('id') id: string,
    @UploadedFile() files,
    @Body() data: UpdateProductDTO,
    @Req() request
  ): Promise<Product> {

    if (request.fileValidationError) {
      throw new BadRequestException(request.fileValidationError);
    }

    return this.service.updateOne(id, data, files);
  }
}
