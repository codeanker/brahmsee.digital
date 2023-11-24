/*
  Warnings:

  - A unique constraint covering the columns `[personId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_accountId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "personId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Account_personId_key" ON "Account"("personId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
