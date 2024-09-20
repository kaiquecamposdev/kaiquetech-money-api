/*
  Warnings:

  - The values [OUTCOME] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('INCOME', 'EXPENSE');
ALTER TABLE "transactionsType" ALTER COLUMN "name" TYPE "Type_new" USING ("name"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;
