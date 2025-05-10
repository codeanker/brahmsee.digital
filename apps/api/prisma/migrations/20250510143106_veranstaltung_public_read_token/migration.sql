/*
  Warnings:

  - A unique constraint covering the columns `[publicReadToken]` on the table `Veranstaltung` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Veranstaltung" ADD COLUMN     "publicReadToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Veranstaltung_publicReadToken_key" ON "Veranstaltung"("publicReadToken");
