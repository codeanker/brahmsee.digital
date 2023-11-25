-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "activatedAt" TIMESTAMP(3);
UPDATE "Account" SET "activatedAt" = NOW()
