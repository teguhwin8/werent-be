import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product with optional image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Premium Cotton Shirt' },
        description: { type: 'string', example: 'High-quality cotton shirt' },
        price: { type: 'number', example: 299000 },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or file validation failed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Validate file if provided
    if (file) {
      const isImage = file.mimetype.startsWith('image/');
      if (!isImage) {
        throw new BadRequestException('Only image files are allowed');
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException(`Image exceeds maximum size of 5MB`);
      }
    }

    return this.productsService.create(createProductDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of products',
  })
  findAll(@Query() queryDto: QueryProductsDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/reviews/summary')
  @ApiOperation({ summary: 'Get review summary for a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns overall rating, total reviews, and fit distribution',
  })
  getReviewsSummary(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getReviewsSummary(id);
  }

  @Get(':id/reviews')
  @ApiOperation({
    summary: 'Get reviews for a product with filters and pagination',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of reviews',
  })
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() queryDto: QueryReviewsDto,
  ) {
    return this.productsService.getReviews(id, queryDto);
  }
}
