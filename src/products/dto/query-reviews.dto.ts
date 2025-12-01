import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FitType } from '../../../generated/prisma/enums';

export class QueryReviewsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['createdAt', 'helpful'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'helpful'])
  sortBy?: 'createdAt' | 'helpful' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order (deprecated, use sortBy instead)',
    enum: ['newest', 'helpful'],
    default: 'newest',
    example: 'newest',
  })
  @IsOptional()
  @IsIn(['newest', 'helpful'])
  sort?: 'newest' | 'helpful';

  @ApiPropertyOptional({
    description: 'Filter by rating values (comma-separated)',
    example: '4,5',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(Number)
        .filter((n) => n >= 1 && n <= 5);
    }
    return [];
  })
  rating?: number[];

  @ApiPropertyOptional({
    description: 'Filter by fit type (comma-separated)',
    enum: FitType,
    example: 'SMALL,TRUE',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value
        .split(',')
        .filter((f) => ['SMALL', 'TRUE', 'LARGE'].includes(f));
    }
    return [];
  })
  fit?: string[];

  @ApiPropertyOptional({
    description: 'Filter to show only reviews with media',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasMedia?: boolean;

  @ApiPropertyOptional({
    description:
      'Filter to show only reviews with media (deprecated, use hasMedia instead)',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  withMedia?: boolean;
}
