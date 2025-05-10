/*
  Warnings:

  - A unique constraint covering the columns `[publicReadToken]` on the table `Veranstaltung` will be added. If there are existing duplicate values, this will fail.

*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AlterTable
ALTER TABLE "Veranstaltung" ADD COLUMN     "publicReadToken" TEXT DEFAULT uuid_generate_v4();

-- CreateIndex
CREATE UNIQUE INDEX "Veranstaltung_publicReadToken_key" ON "Veranstaltung"("publicReadToken");
