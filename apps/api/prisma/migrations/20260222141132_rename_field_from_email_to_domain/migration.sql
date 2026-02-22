/*
  Warnings:

  - You are about to drop the column `email` on the `Gliederung` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gliederung" DROP COLUMN "email",
ADD COLUMN     "domain" TEXT;
