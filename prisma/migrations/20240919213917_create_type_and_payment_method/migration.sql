/*
  Warnings:

  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `client` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `paymentMethodId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('INCOME', 'OUTCOME');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'DEBIT', 'MONEY', 'PIX', 'TED', 'PAYMENTLINK');

-- AlterTable
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_pkey",
DROP COLUMN "client",
DROP COLUMN "paymentMethod",
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "paymentMethodId" TEXT NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL,
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id", "paymentMethodId", "typeId");

-- CreateTable
CREATE TABLE "transactionPaymentMethods" (
    "id" TEXT NOT NULL,
    "name" "PaymentMethod" NOT NULL,

    CONSTRAINT "transactionPaymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactionTypes" (
    "id" TEXT NOT NULL,
    "name" "Type" NOT NULL,

    CONSTRAINT "transactionTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "transactionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "transactionPaymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
