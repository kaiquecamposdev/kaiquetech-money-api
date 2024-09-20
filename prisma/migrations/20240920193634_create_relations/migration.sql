/*
  Warnings:

  - You are about to drop the `transactionPaymentMethods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionTypes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[typeId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentMethodId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_typeId_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "amount" DOUBLE PRECISION;

-- DropTable
DROP TABLE "transactionPaymentMethods";

-- DropTable
DROP TABLE "transactionTypes";

-- CreateTable
CREATE TABLE "transactionsPaymentMethod" (
    "id" TEXT NOT NULL,
    "name" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transactionsPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactionsType" (
    "id" TEXT NOT NULL,
    "name" "Type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transactionsType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_typeId_key" ON "transactions"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_paymentMethodId_key" ON "transactions"("paymentMethodId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "transactionsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "transactionsPaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
