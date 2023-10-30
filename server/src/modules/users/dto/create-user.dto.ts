import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserRoleEnum } from '../enums';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty({
    example: 'Mike Vincent',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 256,
  })
  public readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(256)
  @ApiProperty({
    example: 'example@gmail.com',
    required: true,
    nullable: false,
    maxLength: 256,
  })
  public readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  @ApiProperty({
    example: 'password1234',
    required: true,
    nullable: false,
    minLength: 6,
    maxLength: 64,
  })
  public readonly password: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  @ApiProperty({
    enum: UserRoleEnum,
    examples: UserRoleEnum,
    required: false,
    default: UserRoleEnum.USER,
  })
  public readonly role: UserRoleEnum;

  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({
    example: 'ІП-04',
    required: true,
    nullable: false,
    minLength: 2,
    maxLength: 8,
  })
  public readonly group: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 12,
    required: true,
    nullable: false,
    minimum: 0,
  })
  public readonly variant: number;
}
