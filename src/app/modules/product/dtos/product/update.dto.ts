import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';


export class UpdateProductDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Black Check Cotton Taaga Man Panjabi',
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;


  @ApiProperty({
    format: 'binary',
    required: false,
    example: 'product image files'
  })
  @IsOptional()
  readonly productImages!: string;


  @ApiProperty({
    type: String,
    required: false,
    example: 'Black cotton Taaga Man panjabi with grey check detailing. Features in-seam side pockets. Available in both classic and slim fit.',
  })
  @IsOptional()
  @IsString()
  readonly description!: string;


  @ApiProperty({
    type: String,
    required: true,
    example: `piece`,
  })
  @IsNotEmpty()
  @IsString()
  readonly unit!: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
  })
  @IsNotEmpty()
  price!: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
  })
  @IsNotEmpty()
  stock!: number;
  

}
