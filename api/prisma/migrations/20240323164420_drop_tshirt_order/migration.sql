/*
  Warnings:

  - You are about to drop the column `konfektionsgroesse` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "konfektionsgroesse";

-- DropEnum
DROP TYPE "Konfektionsgroesse";
