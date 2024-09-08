/*
  Warnings:

  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT false;
