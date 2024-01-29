/*
  Warnings:

  - A unique constraint covering the columns `[dlrgOauthId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "dlrgOauthId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_dlrgOauthId_key" ON "Account"("dlrgOauthId");
