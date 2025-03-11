import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterProductDTO {
  @ApiProperty({
    type: Number,
    description: 'Limit the number of results',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly limit: number = 10;

  @ApiProperty({
    type: Number,
    description: 'The page number',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly page: number = 1;

  @ApiProperty({
    type: String,
    description: 'The search term',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly searchTerm!: string;

  @ApiProperty({
    type: String,
    description: 'department uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly departmentId!: string;

  @ApiProperty({
    type: String,
    description: 'category uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly categoryId!: string;

  @ApiProperty({
    type: String,
    description: 'brand uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly brandId!: string;

}
