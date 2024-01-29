/*
  Warnings:

  - The values [DELIGATIONSLEITER] on the enum `GliederungAccountRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GliederungAccountRole_new" AS ENUM ('DELEGATIONSLEITER', 'BETREUER', 'TEILNEHMER');
ALTER TABLE "GliederungToAccount" ALTER COLUMN "role" TYPE "GliederungAccountRole_new" USING ("role"::text::"GliederungAccountRole_new");
ALTER TYPE "GliederungAccountRole" RENAME TO "GliederungAccountRole_old";
ALTER TYPE "GliederungAccountRole_new" RENAME TO "GliederungAccountRole";
DROP TYPE "GliederungAccountRole_old";
COMMIT;
