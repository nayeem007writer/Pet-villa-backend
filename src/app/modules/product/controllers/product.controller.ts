import {
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FilterProductDTO } from '../dtos';
import { Product } from '../entities/product.entity';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  RELATIONS = ['variantOptions'];
  constructor(private readonly service: ProductService) { }

  @Get()
  async findAll(
    @Query() query: FilterProductDTO
  ): Promise<SuccessResponse | Product[]> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  // @Post()
  // @ApiConsumes("multipart/form-data")
  // @ApiBody({ type: CreateProductDTO })
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: "thumbImage", maxCount: 1 },
  //     { name: "productImages", maxCount: 5 },
  //     { name: "productVideo", maxCount: 1 },
  //   ], {
  //     storage: storageOptions,
  //     // fileFilter: ImageFilter,
  //     // limits: { fileSize: ENV.IMAGE_MAX_SIZE },
  //   })
  // )
  // async createOne(
  //   @UploadedFile() files,
  //   @Body() data: CreateProductDTO,
  //   @Req() request
  // ): Promise<any> {
  //   let _data: any = { ...data }
  //   console.log("🚀 ~ file: product.controller.ts:65 ~ ProductController ~ _data:", _data)

  //   if (request.fileValidationError) {
  //     throw new BadRequestException(request.fileValidationError);
  //   }

  //   return this.service.createOne(_data, request.files);
  // }

  // @Put(':id')
  // @ApiConsumes("multipart/form-data")
  // @ApiBody({ type: UpdateProductDTO })
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: "thumbImage", maxCount: 1 },
  //     { name: "productImages", maxCount: 5 },
  //     { name: "productVideo", maxCount: 1 },
  //   ], {
  //     storage: storageOptions,
  //     fileFilter: ImageFilter,
  //     limits: { fileSize: ENV.IMAGE_MAX_SIZE },
  //   })
  // )
  // async updateOne(
  //   @Param('id') id: string,
  //   @UploadedFile() files,
  //   @Body() data: UpdateProductDTO,
  //   @Req() request
  // ): Promise<Product> {

  //   if (request.fileValidationError) {
  //     throw new BadRequestException(request.fileValidationError);
  //   }

  //   return this.service.updateOne(id, data, files);
  // }

  // @Delete(':id')
  // async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
  //   return this.service.deleteOneBase(id);
  // }
}
