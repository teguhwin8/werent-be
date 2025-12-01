import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { FitType } from '../../generated/prisma/enums';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    let imageUrl: string | undefined;

    // Upload image to Cloudinary if provided
    if (file) {
      const uploadResult = await this.uploadService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        imageUrl,
      },
    });
  }

  async findAll(queryDto: QueryProductsDto) {
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Build orderBy clause
    const orderBy: any = { [sortBy]: sortOrder };

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    };
  }

  async getReviewsSummary(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          select: {
            rating: true,
            fit: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calculate fit distribution
    const fitDistribution = {
      small: 0,
      true: 0,
      large: 0,
    };

    product.reviews.forEach((review) => {
      if (review.fit === FitType.SMALL) fitDistribution.small++;
      else if (review.fit === FitType.TRUE) fitDistribution.true++;
      else if (review.fit === FitType.LARGE) fitDistribution.large++;
    });

    return {
      overallRating: product.overallRating,
      totalReviews: product.totalReviews,
      fitDistribution,
    };
  }

  async getReviews(productId: number, queryDto: QueryReviewsDto) {
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;

    // Support both old and new parameter names
    const sortBy =
      queryDto.sortBy ||
      (queryDto.sort === 'helpful' ? 'helpful' : 'createdAt');
    const hasMedia = queryDto.hasMedia ?? queryDto.withMedia;
    const { rating, fit } = queryDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { productId };

    if (rating && rating.length > 0) {
      where.rating = { in: rating };
    }

    if (fit && fit.length > 0) {
      where.fit = { in: fit };
    }

    if (hasMedia) {
      where.media = {
        some: {},
      };
    }

    // Build orderBy clause
    let orderBy: any = {};
    if (sortBy === 'helpful') {
      orderBy = [{ helpful: { _count: 'desc' } }, { createdAt: 'desc' }];
    } else {
      orderBy = { createdAt: 'desc' };
    }

    // Fetch reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          media: {
            select: {
              id: true,
              type: true,
              url: true,
            },
          },
          helpful: {
            select: {
              userId: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    // Transform reviews data
    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      content: review.content,
      helpfulCount: review.helpful.length,
      createdAt: review.createdAt,
      editedAt: review.editedAt,
      user: review.user,
      userMeasurement: {
        waist: review.waist,
        bust: review.bust,
        hips: review.hips,
      },
      fit: review.fit,
      media: review.media,
    }));

    return {
      data: transformedReviews,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
