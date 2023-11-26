-- CreateEnum
CREATE TYPE "UnterveranstaltungType" AS ENUM ('CREW', 'GLIEDERUNG');

-- AlterTable
ALTER TABLE "Unterveranstaltung" ADD COLUMN     "type" "UnterveranstaltungType" NOT NULL DEFAULT 'GLIEDERUNG';
