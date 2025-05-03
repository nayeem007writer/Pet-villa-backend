import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "../../entities/product.entity";
import { IsEnum, IsOptional } from "class-validator";

export class StatusDto { 

  @ApiProperty({ 
    example: ProductStatus.AVAILABLE, 
    description: "Status of the pet", 
    enum: ProductStatus, 
    required: false 
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status!: ProductStatus;

}