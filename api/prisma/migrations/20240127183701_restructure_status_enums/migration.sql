/*
  Warnings:

  - The values [OPEN,ACTIVE,DISABLED] on the enum `AccountStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ANGENOMMEN] on the enum `AnmeldungStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountStatus_new" AS ENUM ('OFFEN', 'AKTIV', 'DEAKTIVIERT');
ALTER TABLE "Account" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "status" TYPE "AccountStatus_new" USING ("status"::text::"AccountStatus_new");
ALTER TYPE "AccountStatus" RENAME TO "AccountStatus_old";
ALTER TYPE "AccountStatus_new" RENAME TO "AccountStatus";
DROP TYPE "AccountStatus_old";
ALTER TABLE "Account" ALTER COLUMN "status" SET DEFAULT 'OFFEN';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AnmeldungStatus_new" AS ENUM ('OFFEN', 'BESTAETIGT', 'STORNIERT', 'ABGELEHNT');
ALTER TABLE "Anmeldung" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Anmeldung" ALTER COLUMN "status" TYPE "AnmeldungStatus_new" USING ("status"::text::"AnmeldungStatus_new");
ALTER TYPE "AnmeldungStatus" RENAME TO "AnmeldungStatus_old";
ALTER TYPE "AnmeldungStatus_new" RENAME TO "AnmeldungStatus";
DROP TYPE "AnmeldungStatus_old";
ALTER TABLE "Anmeldung" ALTER COLUMN "status" SET DEFAULT 'OFFEN';
COMMIT;

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "status" SET DEFAULT 'OFFEN';
