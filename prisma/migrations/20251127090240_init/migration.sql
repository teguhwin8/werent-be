-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "avatarUrl" VARCHAR(255) NOT NULL,
    "rating" INTEGER NOT NULL,
    "measurement" VARCHAR(255) NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
