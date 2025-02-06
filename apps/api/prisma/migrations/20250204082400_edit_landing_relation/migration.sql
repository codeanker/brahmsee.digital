/*
  Warnings:

  - The primary key for the `_AnmeldungToMahlzeit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FaqToUnterveranstaltung` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[landingSettingsId]` on the table `Unterveranstaltung` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_AnmeldungToMahlzeit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_FaqToUnterveranstaltung` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `landingSettingsId` to the `Unterveranstaltung` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UnterveranstaltungLandingSettings" DROP CONSTRAINT "UnterveranstaltungLandingSettings_unterveranstaltungId_fkey";

-- AlterTable
ALTER TABLE "Unterveranstaltung" ADD COLUMN     "landingSettingsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" DROP CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey";

-- AlterTable
ALTER TABLE "_FaqToUnterveranstaltung" DROP CONSTRAINT "_FaqToUnterveranstaltung_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Unterveranstaltung_landingSettingsId_key" ON "Unterveranstaltung"("landingSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_FaqToUnterveranstaltung_AB_unique" ON "_FaqToUnterveranstaltung"("A", "B");

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_landingSettingsId_fkey" FOREIGN KEY ("landingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("unterveranstaltungId") ON DELETE CASCADE ON UPDATE CASCADE;
