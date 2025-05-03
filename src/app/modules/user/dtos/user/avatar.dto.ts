import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AvatarDTO {
    @ApiProperty({
    format: 'binary',
    required: false,
    example: 'product image files'
  })
  @IsOptional()
  @IsString()
  readonly productImages!: string;

}