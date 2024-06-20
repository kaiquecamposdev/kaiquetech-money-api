-- CreateTable
CREATE TABLE "trasanctions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "description" TEXT,
    "category" TEXT,
    "paymentMethod" TEXT NOT NULL,

    CONSTRAINT "trasanctions_pkey" PRIMARY KEY ("id")
);
