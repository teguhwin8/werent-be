import {
  IsInt,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FitType } from '../../../generated/prisma/enums';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Product rating from 1 to 5',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Review content (10-1000 characters)',
    minLength: 10,
    maxLength: 1000,
    example:
      'This product fits perfectly! The quality is amazing and the size matches my measurements.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description:
      'Waist measurement in centimeters (50-150) - Optional for clothing items',
    minimum: 50,
    maximum: 150,
    example: 75,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(50)
  @Max(150)
  waist?: number;

  @ApiPropertyOptional({
    description:
      'Bust measurement in centimeters (60-150) - Optional for clothing items',
    minimum: 60,
    maximum: 150,
    example: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(60)
  @Max(150)
  bust?: number;

  @ApiPropertyOptional({
    description:
      'Hips measurement in centimeters (60-160) - Optional for clothing items',
    minimum: 60,
    maximum: 160,
    example: 95,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(60)
  @Max(160)
  hips?: number;

  @ApiPropertyOptional({
    description: 'How the product fits - Optional for clothing items',
    enum: FitType,
    example: 'TRUE',
  })
  @IsOptional()
  @IsEnum(FitType)
  fit?: FitType;
}
