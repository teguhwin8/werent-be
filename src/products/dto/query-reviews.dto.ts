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
    description: 'Sort order',
    enum: ['newest', 'helpful'],
    default: 'newest',
    example: 'newest',
  })
  @IsOptional()
  @IsIn(['newest', 'helpful'])
  sort?: 'newest' | 'helpful' = 'newest';

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
    description: 'Filter to show only reviews with media',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  withMedia?: boolean;
}
