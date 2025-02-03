/*
  Warnings:

  - The primary key for the `_AnmeldungToMahlzeit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FaqToUnterveranstaltung` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AnmeldungToMahlzeit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_FaqToUnterveranstaltung` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" DROP CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey";

-- AlterTable
ALTER TABLE "_FaqToUnterveranstaltung" DROP CONSTRAINT "_FaqToUnterveranstaltung_AB_pkey";

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingSettings" (
    "id" SERIAL NOT NULL,
    "unterveranstaltungId" INTEGER NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "eventDetailsTitle" TEXT NOT NULL,
    "eventDetailsContent" TEXT NOT NULL,
    "miscellaneousVisible" BOOLEAN,
    "miscellaneousTitle" TEXT,
    "faqVisible" BOOLEAN,
    "instagramVisible" BOOLEAN,
    "instagramUrl" TEXT,
    "facebookVisible" BOOLEAN,
    "facebookUrl" TEXT,

    CONSTRAINT "UnterveranstaltungLandingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingImages" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "unterveranstaltungLandingSettingsId" INTEGER,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "UnterveranstaltungLandingImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingMiscellaneous" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "conent" TEXT NOT NULL,
    "unterveranstaltungLandingSettingsId" INTEGER,

    CONSTRAINT "UnterveranstaltungLandingMiscellaneous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungLandingImages_fileId_key" ON "UnterveranstaltungLandingImages"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_FaqToUnterveranstaltung_AB_unique" ON "_FaqToUnterveranstaltung"("A", "B");

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingSettings" ADD CONSTRAINT "UnterveranstaltungLandingSettings_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_unterveranstaltungLandingS_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingMiscellaneous" ADD CONSTRAINT "UnterveranstaltungLandingMiscellaneous_unterveranstaltungL_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
