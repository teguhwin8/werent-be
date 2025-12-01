import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { MediaType } from '../../generated/prisma/enums';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async createReview(
    productId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
    files?: Express.Multer.File[],
  ) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Upload files to Cloudinary if provided
    const mediaData: Array<{ url: string; publicId: string; type: MediaType }> =
      [];
    if (files && files.length > 0) {
      for (const file of files) {
        const isVideo = file.mimetype.startsWith('video/');
        const uploadResult = isVideo
          ? await this.uploadService.uploadVideo(file)
          : await this.uploadService.uploadImage(file);

        mediaData.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type: isVideo ? MediaType.VIDEO : MediaType.PHOTO,
        });
      }
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: createReviewDto.rating,
        content: createReviewDto.content,
        waist: createReviewDto.waist,
        bust: createReviewDto.bust,
        hips: createReviewDto.hips,
        fit: createReviewDto.fit,
        media: mediaData.length > 0 ? { create: mediaData } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        media: true,
      },
    });

    // Update product statistics
    await this.updateProductStats(productId);

    return review;
  }

  async toggleHelpful(reviewId: number, userId: number) {
    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if user already marked as helpful
    const existingHelpful = await this.prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingHelpful) {
      // Remove helpful
      await this.prisma.reviewHelpful.delete({
        where: {
          reviewId_userId: {
            reviewId,
            userId,
          },
        },
      });

      return {
        message: 'Helpful removed',
        isHelpful: false,
        helpfulCount: await this.getHelpfulCount(reviewId),
      };
    } else {
      // Add helpful
      await this.prisma.reviewHelpful.create({
        data: {
          reviewId,
          userId,
        },
      });

      return {
        message: 'Helpful added',
        isHelpful: true,
        helpfulCount: await this.getHelpfulCount(reviewId),
      };
    }
  }

  async deleteHelpful(reviewId: number, userId: number) {
    const existingHelpful = await this.prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (!existingHelpful) {
      throw new NotFoundException('Helpful not found');
    }

    await this.prisma.reviewHelpful.delete({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    return {
      message: 'Helpful removed successfully',
      helpfulCount: await this.getHelpfulCount(reviewId),
    };
  }

  private async getHelpfulCount(reviewId: number): Promise<number> {
    return await this.prisma.reviewHelpful.count({
      where: { reviewId },
    });
  }

  private async updateProductStats(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const overallRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        totalReviews,
        overallRating: parseFloat(overallRating.toFixed(1)),
      },
    });
  }
}
