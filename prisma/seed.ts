import { prisma } from './lib/prisma';
import { FitType } from '../generated/prisma/enums';
import * as bcrypt from 'bcrypt';

function getRandomRating() {
  return Math.floor(Math.random() * 4) + 2;
}

function getRandomFit(): FitType {
  const fits: FitType[] = [FitType.SMALL, FitType.TRUE, FitType.LARGE];
  return fits[Math.floor(Math.random() * fits.length)];
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create Users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          password: hashedPassword,
          name: 'John Doe',
          avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
        },
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          password: hashedPassword,
          name: 'Jane Smith',
          avatarUrl: 'https://randomuser.me/api/portraits/women/34.jpg',
        },
      }),
      prisma.user.create({
        data: {
          email: 'mike.wilson@example.com',
          password: hashedPassword,
          name: 'Mike Wilson',
          avatarUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
        },
      }),
      prisma.user.create({
        data: {
          email: 'sarah.jones@example.com',
          password: hashedPassword,
          name: 'Sarah Jones',
          avatarUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
        },
      }),
      prisma.user.create({
        data: {
          email: 'david.brown@example.com',
          password: hashedPassword,
          name: 'David Brown',
          avatarUrl: 'https://randomuser.me/api/portraits/men/77.jpg',
        },
      }),
      prisma.user.create({
        data: {
          email: 'lisa.taylor@example.com',
          password: hashedPassword,
          name: 'Lisa Taylor',
          avatarUrl: 'https://randomuser.me/api/portraits/women/11.jpg',
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users\n`);

    // 2. Create Products
    console.log('📦 Creating products...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Elegant Summer Dress',
          description:
            'Beautiful floral pattern dress perfect for summer occasions',
          imageUrl:
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
          price: 299000,
          sizes: ['S', 'M', 'L', 'XL'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Classic White Shirt',
          description: 'Timeless white cotton shirt for any occasion',
          imageUrl:
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
          price: 189000,
          sizes: ['S', 'M', 'L'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Casual Denim Jacket',
          description: 'Versatile denim jacket for casual outings',
          imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
          price: 449000,
          sizes: ['M', 'L', 'XL', 'XXL'],
        },
      }),
    ]);

    console.log(`✅ Created ${products.length} products\n`);

    // 3. Create Reviews
    console.log('⭐ Creating reviews...');
    const reviewsData = [
      {
        productId: products[0].id,
        userId: users[0].id,
        rating: 5,
        content:
          'Absolutely love this dress! The fit is perfect and the material is high quality. Very comfortable to wear all day.',
        waist: 76,
        bust: 88,
        hips: 96,
        fit: FitType.TRUE,
        createdAt: new Date('2025-02-10'),
      },
      {
        productId: products[0].id,
        userId: users[1].id,
        rating: 4,
        content:
          'The design is simple and clean. The material could be a bit thicker but overall good quality.',
        waist: 70,
        bust: 84,
        hips: 92,
        fit: FitType.SMALL,
        createdAt: new Date('2025-03-15'),
      },
      {
        productId: products[0].id,
        userId: users[2].id,
        rating: 4,
        content:
          'Nice overall. The stitching is decent but the fit is slightly loose around the waist.',
        waist: 80,
        bust: 92,
        hips: 98,
        fit: FitType.LARGE,
        createdAt: new Date('2025-04-20'),
      },
      {
        productId: products[0].id,
        userId: users[3].id,
        rating: 5,
        content:
          'Comfortable enough for daily use. The color is exactly as shown in the pictures!',
        waist: 68,
        bust: 82,
        hips: 90,
        fit: FitType.TRUE,
        createdAt: new Date('2025-05-18'),
      },
      {
        productId: products[1].id,
        userId: users[4].id,
        rating: 3,
        content:
          'Lightweight and soft. The size runs a bit smaller than expected, consider sizing up.',
        waist: 82,
        bust: 96,
        hips: 104,
        fit: FitType.SMALL,
        createdAt: new Date('2025-02-28'),
      },
      {
        productId: products[1].id,
        userId: users[5].id,
        rating: 4,
        content:
          'Looks good and feels okay. Could be better in terms of durability but good for the price.',
        waist: 72,
        bust: 86,
        hips: 94,
        fit: FitType.TRUE,
        createdAt: new Date('2025-03-05'),
      },
      {
        productId: products[1].id,
        userId: users[0].id,
        rating: 5,
        content:
          'The texture is smooth and the weight is nice. Perfect for office wear!',
        waist: 78,
        bust: 90,
        hips: 100,
        fit: FitType.TRUE,
        createdAt: new Date('2025-01-17'),
      },
      {
        productId: products[2].id,
        userId: users[1].id,
        rating: 4,
        content:
          'Quality is decent for the price. Fits slightly tighter on the sleeves.',
        waist: 74,
        bust: 88,
        hips: 96,
        fit: FitType.SMALL,
        createdAt: new Date('2025-04-01'),
      },
      {
        productId: products[2].id,
        userId: users[2].id,
        rating: 5,
        content:
          'Simple and comfortable. A few loose threads but nothing major. Great jacket!',
        waist: 80,
        bust: 94,
        hips: 102,
        fit: FitType.TRUE,
        createdAt: new Date('2025-06-01'),
      },
      {
        productId: products[2].id,
        userId: users[3].id,
        rating: 3,
        content:
          'Nice color and decent comfort. Could use more size options for petite frames.',
        waist: 66,
        bust: 80,
        hips: 88,
        fit: FitType.LARGE,
        createdAt: new Date('2025-03-22'),
      },
    ];

    const reviews = await Promise.all(
      reviewsData.map((review) => prisma.review.create({ data: review })),
    );

    console.log(`✅ Created ${reviews.length} reviews\n`);

    // 4. Create Review Helpful (likes)
    console.log('👍 Creating helpful votes...');
    const helpfulData = [
      { reviewId: reviews[0].id, userId: users[1].id },
      { reviewId: reviews[0].id, userId: users[2].id },
      { reviewId: reviews[0].id, userId: users[3].id },
      { reviewId: reviews[1].id, userId: users[0].id },
      { reviewId: reviews[2].id, userId: users[4].id },
      { reviewId: reviews[3].id, userId: users[5].id },
      { reviewId: reviews[4].id, userId: users[1].id },
      { reviewId: reviews[6].id, userId: users[2].id },
      { reviewId: reviews[6].id, userId: users[3].id },
      { reviewId: reviews[8].id, userId: users[0].id },
    ];

    await Promise.all(
      helpfulData.map((helpful) =>
        prisma.reviewHelpful.create({ data: helpful }),
      ),
    );

    console.log(`✅ Created ${helpfulData.length} helpful votes\n`);

    // 5. Update product ratings and review counts
    console.log('📊 Updating product statistics...');
    for (const product of products) {
      const productReviews = await prisma.review.findMany({
        where: { productId: product.id },
      });

      const totalReviews = productReviews.length;
      const overallRating =
        totalReviews > 0
          ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          totalReviews,
          overallRating: parseFloat(overallRating.toFixed(1)),
        },
      });
    }

    console.log('✅ Updated product statistics\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Helpful votes: ${helpfulData.length}\n`);
    console.log('🔑 Test credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: password123\n');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
