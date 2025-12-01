import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../prisma/lib/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Expose all Prisma Client methods
  user = prisma.user;
  product = prisma.product;
  review = prisma.review;
  reviewHelpful = prisma.reviewHelpful;
  reviewMedia = prisma.reviewMedia;

  // Expose utility methods
  $connect = prisma.$connect.bind(prisma);
  $disconnect = prisma.$disconnect.bind(prisma);
  $transaction = prisma.$transaction.bind(prisma);
  $queryRaw = prisma.$queryRaw.bind(prisma);
  $executeRaw = prisma.$executeRaw.bind(prisma);

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
