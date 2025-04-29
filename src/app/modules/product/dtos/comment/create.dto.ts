import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ProductStatus,PetSpecies, PetGender } from '../../entities/product.entity';

export class CreateCommentDTO {


  @ApiProperty({ example: 2, description: "address", required: false })
  @IsOptional()
  @IsString()
  address?: string;


  @ApiProperty({ example: "Friendly and playful dog", description: "Description of the pet", required: false })
  @IsOptional()
  @IsString()
  description!: string;

}