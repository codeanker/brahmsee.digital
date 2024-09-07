/*
  Warnings:

  - A unique constraint covering the columns `[activationToken]` on the table `Anmeldung` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Anmeldung" ADD COLUMN     "activationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Anmeldung_activationToken_key" ON "Anmeldung"("activationToken");
