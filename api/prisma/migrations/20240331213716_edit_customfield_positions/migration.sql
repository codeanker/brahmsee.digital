/*
  Warnings:

  - The values [PUBLIC_PERSON,INTERN_PERSON,INTERN_VERANSTALTUNG,INTERN_AUSSCHREIBUNG] on the enum `CustomFieldPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CustomFieldPosition_new" AS ENUM ('PUBLIC_ANMELDUNG', 'INTERN_ANMELDUNG');
ALTER TABLE "CustomField" ALTER COLUMN "positions" TYPE "CustomFieldPosition_new"[] USING ("positions"::text::"CustomFieldPosition_new"[]);
ALTER TYPE "CustomFieldPosition" RENAME TO "CustomFieldPosition_old";
ALTER TYPE "CustomFieldPosition_new" RENAME TO "CustomFieldPosition";
DROP TYPE "CustomFieldPosition_old";
COMMIT;
