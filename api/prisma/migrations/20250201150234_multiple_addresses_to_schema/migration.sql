/*
  Warnings:

  - You are about to drop the column `tshirtBestellt` on the `Anmeldung` table. All the data in the column will be lost.
  - You are about to drop the column `konfektionsgroesse` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `qualifikationenErsteHilfe` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `qualifikationenFahrerlaubnis` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `qualifikationenFunk` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `qualifikationenSanitaeter` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `qualifikationenSchwimmer` on the `Person` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "Anmeldung" DROP COLUMN "tshirtBestellt",
ADD COLUMN     "accountId" INTEGER;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "konfektionsgroesse",
DROP COLUMN "qualifikationenErsteHilfe",
DROP COLUMN "qualifikationenFahrerlaubnis",
DROP COLUMN "qualifikationenFunk",
DROP COLUMN "qualifikationenSanitaeter",
DROP COLUMN "qualifikationenSchwimmer";

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnmeldungToMahlzeit_AB_unique";

-- DropEnum
DROP TYPE "Konfektionsgroesse";

-- DropEnum
DROP TYPE "QualificationErsteHilfe";

-- DropEnum
DROP TYPE "QualificationFahrerlaubnis";

-- DropEnum
DROP TYPE "QualificationFunk";

-- DropEnum
DROP TYPE "QualificationSanitaeter";

-- DropEnum
DROP TYPE "QualificationSchwimmer";

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
