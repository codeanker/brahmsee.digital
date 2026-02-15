/*
  Warnings:

  - Added the required column `createdAt` to the `GliederungToAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GliederungToAccount" ADD COLUMN     "confirmByGliederungToken" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedByGliederung" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;
