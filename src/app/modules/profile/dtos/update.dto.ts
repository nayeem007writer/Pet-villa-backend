import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Zahid',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Hasan',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '01636476123',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(11)
  @MaxLength(11)
  readonly phoneNumber!: string;

}