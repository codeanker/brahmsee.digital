-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('OPEN', 'ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'OPEN';
