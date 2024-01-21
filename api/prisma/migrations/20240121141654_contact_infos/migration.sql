/*
  Warnings:

  - Added the required column `email` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefon` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "telefon" TEXT NOT NULL;
