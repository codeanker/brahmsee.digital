/*
  Warnings:

  - Added the required column `email` to the `Anmeldung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anmeldung" ADD COLUMN     "email" TEXT NOT NULL;
