# WeRent Backend API Documentation for Frontend

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
Swagger Docs: http://localhost:3000/api/docs
```

## Authentication

The API uses JWT Bearer token authentication for protected endpoints.

### Headers Required

```typescript
{
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json' // or 'multipart/form-data' for file uploads
}
```

---

## 📌 API Endpoints

### 1. Authentication

#### Register

```http
POST /auth/register
```

**Request Body:**

```typescript
{
  email: string;
  password: string; // min 6 characters
  name: string;
  avatarUrl?: string;
}
```

**Response:**

```typescript
{
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatarUrl: string | null;
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**

```typescript
{
  email: string;
  password: string;
}
```

**Response:**

```typescript
{
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatarUrl: string | null;
  }
}
```

#### Get Current User

```http
GET /auth/me
Headers: Authorization: Bearer {token}
```

**Response:**

```typescript
{
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
}
```

---

### 2. Products

#### Get All Products

```http
GET /products?page=1&limit=10&search=shirt
```

**Query Parameters:**

| Parameter | Type   | Default | Description             |
| --------- | ------ | ------- | ----------------------- |
| page      | number | 1       | Page number             |
| limit     | number | 10      | Items per page          |
| search    | string | -       | Search products by name |

**Response:**

```typescript
{
  data: Array<{
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    overallRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  }
}
```

#### Create Product 🔒

```http
POST /products
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

```typescript
{
  name: string; // required
  description?: string; // optional
  price?: number; // optional
  image?: File; // optional - product image (jpg, png, webp, max 5MB)
}
```

**Example with JavaScript:**

```javascript
const formData = new FormData();
formData.append('name', 'Premium Leather Bag');
formData.append('description', 'High-quality leather bag');
formData.append('price', '599000');
formData.append('image', imageFile); // File object from input[type="file"]

const response = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Response:**

```typescript
{
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null; // Cloudinary URL if image uploaded
  price: number | null;
  overallRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Get Product Detail

```http
GET /products/:id
```

**Response:**

```typescript
{
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  overallRating: number; // 0-5
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Get Review Summary

```http
GET /products/:id/reviews/summary
```

**Response:**

```typescript
{
  overallRating: number; // average rating
  totalReviews: number;
  fitDistribution: {
    small: number; // count
    true: number;
    large: number;
  };
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

#### Get Reviews List

```http
GET /products/:id/reviews?page=1&limit=10&sort=newest&rating=5&withMedia=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| sort | 'newest' \| 'helpful' | 'newest' | Sort order |
| rating | string | - | Filter by rating (e.g., "5" or "4,5") |
| withMedia | boolean | - | Show only reviews with photos/videos |

**Response:**

```typescript
{
  data: Array<{
    id: number;
    rating: number; // 1-5
    content: string;
    waist: number; // cm
    bust: number; // cm
    hips: number; // cm
    fit: 'SMALL' | 'TRUE' | 'LARGE';
    createdAt: string;
    updatedAt: string;
    editedAt: string | null;
    user: {
      id: number;
      name: string;
      avatarUrl: string | null;
    };
    media: Array<{
      id: number;
      type: 'PHOTO' | 'VIDEO';
      url: string;
    }>;
    helpfulCount: number;
    isHelpful: boolean; // true if current user marked as helpful
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

---

### 3. Reviews

#### Create Review (with file upload)

```http
POST /reviews/products/:productId
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

```typescript
{
  rating: number; // 1-5 (required)
  content: string; // 10-1000 characters (required)
  waist?: number; // cm (optional - for clothing items)
  bust?: number; // cm (optional - for clothing items)
  hips?: number; // cm (optional - for clothing items)
  fit?: 'SMALL' | 'TRUE' | 'LARGE'; // optional - for clothing items
  media: File[]; // optional, max 5 files
}
```

**Note:** Body measurements (`waist`, `bust`, `hips`, `fit`) are **optional**. Only include them for clothing items or if the user wants to share their measurements.

**Validation Rules:**

- Rating: 1-5 (required)
- Content: 10-1000 characters (required)
- Waist: 50-150 cm (optional)
- Bust: 60-150 cm (optional)
- Hips: 60-160 cm (optional)
- Fit: SMALL | TRUE | LARGE (optional)
- Files: Max 5 files (optional)
  - Photos: jpg, png, webp (max 5MB each)
  - Videos: mp4, mov (max 50MB each)

**Response:**

```typescript
{
  id: number;
  rating: number;
  content: string;
  waist?: number | null;
  bust?: number | null;
  hips?: number | null;
  fit?: 'SMALL' | 'TRUE' | 'LARGE' | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl: string | null;
  }
  media: Array<{
    id: number;
    type: 'PHOTO' | 'VIDEO';
    url: string;
  }>;
}
```

#### Mark Review as Helpful

```http
POST /reviews/:id/helpful
Headers: Authorization: Bearer {token}
```

**Response:**

```typescript
{
  message: string;
  helpfulCount: number;
}
```

#### Unmark Review as Helpful

```http
DELETE /reviews/:id/helpful
Headers: Authorization: Bearer {token}
```

**Response:**

```typescript
{
  message: string;
  helpfulCount: number;
}
```

---

## 🎨 TypeScript Interfaces

```typescript
// Enums
export enum FitType {
  SMALL = 'SMALL', // Kebesaran
  TRUE = 'TRUE', // Pas
  LARGE = 'LARGE', // Kekecilan
}

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

// User
export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
}

// Product
export interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  overallRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  id: number;
  rating: number;
  content: string;
  waist: number;
  bust: number;
  hips: number;
  fit: FitType;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  user: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  media: ReviewMedia[];
  helpfulCount: number;
  isHelpful?: boolean;
}

// Review Media
export interface ReviewMedia {
  id: number;
  type: MediaType;
  url: string;
}

// Review Summary
export interface ReviewSummary {
  overallRating: number;
  totalReviews: number;
  fitDistribution: {
    small: number;
    true: number;
    large: number;
  };
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Pagination Response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## 🔧 Frontend Integration Examples

### React/Next.js Example

```typescript
// api/auth.ts
export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// api/reviews.ts
export const getReviews = async (
  productId: number,
  params: {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'helpful';
    rating?: string;
    withMedia?: boolean;
  },
) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const response = await fetch(
    `http://localhost:3000/api/products/${productId}/reviews?${query}`,
  );
  return response.json();
};

// api/reviews.ts (create with files)
export const createReview = async (
  productId: number,
  data: {
    rating: number;
    content: string;
    waist: number;
    bust: number;
    hips: number;
    fit: FitType;
    files?: File[];
  },
  token: string,
) => {
  const formData = new FormData();
  formData.append('rating', String(data.rating));
  formData.append('content', data.content);
  formData.append('waist', String(data.waist));
  formData.append('bust', String(data.bust));
  formData.append('hips', String(data.hips));
  formData.append('fit', data.fit);

  if (data.files) {
    data.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await fetch(
    `http://localhost:3000/api/reviews/products/${productId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );
  return response.json();
};
```

---

## ⚠️ Error Responses

All errors follow this format:

```typescript
{
  statusCode: number;
  message: string | string[];
  error: string;
}
```

**Common Status Codes:**

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

**Example Validation Error:**

```json
{
  "statusCode": 400,
  "message": [
    "rating must be between 1 and 5",
    "content must be longer than 10 characters"
  ],
  "error": "Bad Request"
}
```

---

## 🚀 Getting Started

1. **Setup environment variables** (get from backend team):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. **Store JWT token** (after login):

   ```typescript
   // localStorage or cookie
   localStorage.setItem('token', response.access_token);
   ```

3. **Add token to requests**:

   ```typescript
   const token = localStorage.getItem('token');
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Test credentials** (development only):
   ```
   Email: john.doe@example.com
   Password: password123
   ```

---

## 📞 Support

For questions or issues, contact backend team or check the `API.http` file for manual testing examples.
