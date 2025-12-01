<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="96" alt="NestJS logo" />
</p>

# WeRent Backend API

Production-ready NestJS backend for WeRent - a product rental platform with comprehensive review system, user authentication, and media upload capabilities.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- ⭐ **Review System** - Full-featured product reviews with optional body measurements
- 📸 **Media Upload** - Cloudinary integration for photos/videos (up to 5 files per review)
- 📦 **Product Management** - Create products with image upload, search, and pagination
- 📊 **Analytics** - Review summaries with fit distribution and rating statistics
- 🔍 **Advanced Filtering** - Sort, filter, and paginate reviews
- 👍 **Helpful Votes** - Like/unlike review functionality
- 📖 **Swagger Docs** - Interactive API documentation at `/api/docs`
- ✅ **Validation** - Input validation with class-validator and auto-transform
- 🗄️ **PostgreSQL** - Prisma ORM with type-safe database access

## 🛠 Tech Stack

- **NestJS 11** - Progressive Node.js framework
- **Prisma 7** - Next-generation ORM with PostgreSQL
- **JWT** - Authentication with @nestjs/jwt
- **Cloudinary** - Cloud-based media management
- **Class Validator** - DTO validation
- **TypeScript** - Type safety throughout

## 📋 Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL database
- Cloudinary account (for media upload)

## 🚀 Quick Start

### 1. Clone & Install

```bash
pnpm install
```

### 2. Environment Setup

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/werent?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Database Setup

```bash
# Generate Prisma Client
pnpm exec prisma generate

# Run migrations
pnpm exec prisma migrate deploy

# Seed sample data
pnpm run db:seed
```

### 4. Start Server

```bash
pnpm start:dev
```

✅ **Server**: `http://localhost:3000/api`  
📖 **Swagger Docs**: `http://localhost:3000/api/docs`

## 📚 API Documentation

### Quick Reference

| Endpoint                        | Method | Auth | Description                    |
| ------------------------------- | ------ | ---- | ------------------------------ |
| `/auth/register`                | POST   | ❌   | Register new user              |
| `/auth/login`                   | POST   | ❌   | Login user                     |
| `/auth/me`                      | GET    | ✅   | Get current user               |
| `/products`                     | GET    | ❌   | Get all products (with search) |
| `/products`                     | POST   | ✅   | Create product (with image)    |
| `/products/:id`                 | GET    | ❌   | Get product details            |
| `/products/:id/reviews/summary` | GET    | ❌   | Review statistics              |
| `/products/:id/reviews`         | GET    | ❌   | Get reviews (with filters)     |
| `/reviews/products/:id`         | POST   | ✅   | Create review (with media)     |
| `/reviews/:id/helpful`          | POST   | ✅   | Mark review as helpful         |
| `/reviews/:id/helpful`          | DELETE | ✅   | Remove helpful mark            |

**Interactive Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs) (Swagger UI)

**Full Documentation**: [FRONTEND_API_DOCS.md](./FRONTEND_API_DOCS.md)

**Testing**: Use `API.http` file with VS Code REST Client

**Test Credentials**:

```
Email: john.doe@example.com
Password: password123
```

## 🎯 Key Features

### Product Management

```http
# Get all products with search
GET /products?page=1&limit=10&search=shirt

# Create product with image upload
POST /products
Content-Type: multipart/form-data

- name: Premium Cotton Shirt
- description: High-quality cotton
- price: 299000
- sizes: ["S", "M", "L", "XL"]
- image: [file]
```

### Review Filtering

```http
GET /products/1/reviews?page=1&limit=10&sort=helpful&rating=4,5&withMedia=true
```

- **Pagination**: `page`, `limit`
- **Sort**: `newest` or `helpful`
- **Filter**: Single/multiple ratings, media only

### Review Analytics

```json
GET /products/1/reviews/summary

{
  "overallRating": 4.3,
  "totalReviews": 128,
  "fitDistribution": {
    "small": 10,
    "true": 90,
    "large": 28
  }
}
```

## 📦 Scripts

```bash
# Development
pnpm start:dev          # Watch mode
pnpm start:debug        # Debug mode

# Production
pnpm build              # Build
pnpm start:prod         # Run production

# Database
pnpm exec prisma migrate dev     # New migration
pnpm exec prisma studio          # Visual editor
pnpm run db:seed                 # Seed data

# Testing
pnpm test               # Unit tests
pnpm test:e2e          # E2E tests
```

## 🗂 Project Structure

```
src/
├── auth/               # JWT authentication
├── products/           # Product & review endpoints
├── reviews/            # Review creation & helpful
├── upload/             # Cloudinary service
└── prisma/             # Database service

prisma/
├── schema.prisma       # Database schema
├── migrations/         # Migration history
└── seed.ts            # Sample data

API.http                # API testing
FRONTEND_API_DOCS.md    # Frontend integration guide
```

## 🔐 Environment Variables

| Variable                | Required | Description                    |
| ----------------------- | -------- | ------------------------------ |
| `DATABASE_URL`          | ✅       | PostgreSQL connection string   |
| `JWT_SECRET`            | ✅       | JWT signing key (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME` | ✅       | Cloudinary cloud name          |
| `CLOUDINARY_API_KEY`    | ✅       | Cloudinary API key             |
| `CLOUDINARY_API_SECRET` | ✅       | Cloudinary API secret          |

See `.env.example` for template.

## 🧪 Testing

### Manual Testing

1. Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code
2. Open `API.http`
3. Click "Send Request" on endpoints

### Automated Testing

```bash
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
pnpm test:cov       # Coverage
```

## 🚢 Deployment

```bash
# Build
pnpm build

# Set production env variables
export DATABASE_URL="..."
export JWT_SECRET="..."

# Run
pnpm start:prod
```

**Deployment Checklist:**

- [ ] Production `DATABASE_URL` configured
- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] Cloudinary credentials set
- [ ] Database migrations applied
- [ ] CORS configured for frontend

## 📊 Database Schema

Key models:

```prisma
model User {
  id        Int       @id
  email     String    @unique
  password  String    // bcrypt hashed
  reviews   Review[]
}

model Product {
  id            Int      @id
  name          String
  price         Float?
  sizes         String[] // available sizes (e.g., ["S", "M", "L"])
  imageUrl      String?
  overallRating Float    // cached
  totalReviews  Int      // cached
}

model Review {
  id      Int       @id
  rating  Int       // 1-5
  content String
  waist   Int?      // optional body measurements
  bust    Int?
  hips    Int?
  fit     FitType?  // SMALL | TRUE | LARGE (optional)
  media   ReviewMedia[]  // photos/videos
}
```

[View full schema](./prisma/schema.prisma)

## 📝 License

See [LICENSE](./LICENSE)

## 🔗 Resources

- [Swagger API Docs](http://localhost:3000/api/docs) - Interactive documentation
- [NestJS Docs](https://docs.nestjs.com) - Framework documentation
- [Prisma Docs](https://www.prisma.io/docs) - ORM documentation
- [Frontend API Guide](./FRONTEND_API_DOCS.md) - Integration guide

---

Built with ❤️ using NestJS & Prisma
