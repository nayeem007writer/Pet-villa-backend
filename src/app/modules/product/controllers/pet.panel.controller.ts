import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query as NestQuery,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { ImageFilter, storageImageOptions, storageOptions } from '@src/shared';
import { CreateProductDTO, FilterProductDTO, UpdateProductDTO } from '../dtos';
import { Product, ProductStatus } from '../entities/product.entity';
import { PanelProductService } from '../services/product.panel.service';
import { AuthUser } from '@src/app/decorators';
import { StatusDto } from '../dtos/product/StatusDto';

@ApiTags('Panel Pet')
@ApiBearerAuth()
@Controller('pets')
export class PanelProductController {
  RELATIONS = ['user'];
  constructor(private readonly service: PanelProductService) { }

  // user can see only his own products
  // admin can see all products
  @Get()
  async findAll(
    @NestQuery() query: FilterProductDTO,
    @AuthUser() AuthUser,
  ): Promise<SuccessResponse | Product[]> {
    const user = this.service.findUser(AuthUser.id);
    if((await user).isActive === false) {
      throw new BadRequestException('User is not active');
    }
    return await this.service.findAllBaseById(AuthUser.id,query, { relations: this.RELATIONS });
  }

  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() status: StatusDto,
    @AuthUser() authUser,
  ): Promise<Product> {
    const user = this.service.findUser(authUser.id);
    console.log(id)
    if((await user).isActive === false) {
      throw new BadRequestException('User is not active');
    }
    const product = await this.service.findByIdBase( id, { relations: this.RELATIONS });
    console.log(product)
    if (product.user.id !== authUser.id) {
      throw new BadRequestException('You are not the owner of this product');
    }
  if(product.status === ProductStatus.ADOPTED) {
    throw new BadRequestException('You can not change the status to Adopted');
  }
  if (status.status === status.status) {
    product.status = ProductStatus.ADOPTED;
    return await this.service.updateOneBase(id, product);
  }
  if (status.status === ProductStatus.PENDING) {
    product.status = ProductStatus.PENDING;
    return await this.service.updateOneBase(id, product);
  }
  if (status.status === ProductStatus.AVAILABLE) {
    product.status = ProductStatus.AVAILABLE;
    return await this.service.updateOneBase(id, product);
  }
}

  @Get('customer')
  async findAllForCustomer(
    @Query() query: FilterProductDTO,
    @AuthUser() authUser,
  ):Promise<SuccessResponse | Product[]>  {
      const user = this.service.findUser(authUser.id);
      if((await user).isActive === false) {
        throw new BadRequestException('User is not active');
      }
    return await this.service.findAllBaseLol(query, { relations: this.RELATIONS },(await user).id);
    }

    @Get('admin')
    async findAllForAdmin(
      @Query() query: FilterProductDTO,
      @AuthUser() authUser,
    ):Promise<SuccessResponse | Product[]>  {
        const user = this.service.findUser(authUser.id);
        if((await user).isActive === false) {
          throw new BadRequestException('User is not active');
        }
      return await this.service.findAllBase(query, { relations: this.RELATIONS });
      }    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return await this.service.findByIdBase(id, { relations: this.RELATIONS });
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
    const user = this.service.findUser(authUser.id);
    if((await user).isActive === false) {
      throw new BadRequestException('User is not active');
    }

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
