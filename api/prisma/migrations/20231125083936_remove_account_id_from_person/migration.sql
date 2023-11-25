/*
  Warnings:

  - You are about to drop the column `accountId` on the `Person` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Person_accountId_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "accountId";
