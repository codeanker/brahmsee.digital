/*
  Warnings:

  - The values [OMNIVORE] on the enum `Essgewohnheit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Essgewohnheit_new" AS ENUM ('OMNIVOR', 'VEGETARISCH', 'VEGAN');
ALTER TABLE "Person" ALTER COLUMN "essgewohnheit" TYPE "Essgewohnheit_new" USING ("essgewohnheit"::text::"Essgewohnheit_new");
ALTER TYPE "Essgewohnheit" RENAME TO "Essgewohnheit_old";
ALTER TYPE "Essgewohnheit_new" RENAME TO "Essgewohnheit";
DROP TYPE "Essgewohnheit_old";
COMMIT;
