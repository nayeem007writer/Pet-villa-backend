import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ProductStatus,PetSpecies, PetGender } from '../../entities/product.entity';

export class CreateProductDTO {
  @ApiProperty({ example: "Bella", description: "Name of the pet" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ 
    example: PetSpecies.DOG, 
    description: "Species of the pet", 
    enum: PetSpecies 
  })
  @IsNotEmpty()
  @IsEnum(PetSpecies)
  species!: PetSpecies;

  @ApiProperty({ example: "Golden Retriever", description: "Breed of the pet", required: false })
  @IsOptional()
  @IsString()
  breed!: string;

  @ApiProperty({ example: 2, description: "Age of the pet in years", required: false })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiProperty({ 
    example: "Male", 
    description: "Gender of the pet", 
    enum: PetGender, 
    required: false 
  })
  @IsOptional()
  @IsEnum(PetGender)
  gender?: PetGender;


  @ApiProperty({
    format: 'binary',
    required: false,
    example: 'product image files'
  })
  @IsOptional()
  @IsString()
  readonly productImages!: string;

  @ApiProperty({ example: "Friendly and playful dog", description: "Description of the pet", required: false })
  @IsOptional()
  @IsString()
  description!: string;

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