import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('products/:productId')
  @ApiOperation({
    summary: 'Create a new review with optional media files and measurements',
  })
  @ApiParam({ name: 'productId', description: 'Product ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        content: { type: 'string', minLength: 10, maxLength: 1000 },
        waist: {
          type: 'number',
          minimum: 50,
          maximum: 150,
          description: 'Optional - for clothing items',
        },
        bust: {
          type: 'number',
          minimum: 60,
          maximum: 150,
          description: 'Optional - for clothing items',
        },
        hips: {
          type: 'number',
          minimum: 60,
          maximum: 160,
          description: 'Optional - for clothing items',
        },
        fit: {
          type: 'string',
          enum: ['SMALL', 'TRUE', 'LARGE'],
          description: 'Optional - for clothing items',
        },
        media: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['rating', 'content'],
    },
  })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or file validation failed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FilesInterceptor('media', 5)) // Max 5 files
  async createReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    // Validate file sizes and types
    if (files && files.length > 0) {
      for (const file of files) {
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');

        if (!isImage && !isVideo) {
          throw new BadRequestException(
            'Only image and video files are allowed',
          );
        }

        // Check file size (5MB for images, 50MB for videos)
        const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new BadRequestException(
            `File ${file.originalname} exceeds maximum size of ${isImage ? '5MB' : '50MB'}`,
          );
        }
      }
    }

    return this.reviewsService.createReview(
      productId,
      req.user.id,
      createReviewDto,
      files,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/helpful')
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 201, description: 'Review marked as helpful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  toggleHelpful(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reviewsService.toggleHelpful(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id/helpful')
  @ApiOperation({ summary: 'Remove helpful mark from review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Helpful mark removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteHelpful(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reviewsService.deleteHelpful(id, req.user.id);
  }
}
