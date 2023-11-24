-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_accountId_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "accountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
