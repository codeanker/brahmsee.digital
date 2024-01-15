/*
  Warnings:

  - A unique constraint covering the columns `[activationToken]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "activationToken" TEXT,
ADD COLUMN     "passwordResetToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_activationToken_key" ON "Account"("activationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Account_passwordResetToken_key" ON "Account"("passwordResetToken");
