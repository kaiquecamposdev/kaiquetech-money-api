-- CreateEnum
CREATE TYPE "Type" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'DEBIT', 'MONEY', 'PIX', 'TED', 'PAYMENTLINK');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "client_name" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "sub_category" TEXT,
    "type" "Type" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "payment_method" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION,
    "date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
