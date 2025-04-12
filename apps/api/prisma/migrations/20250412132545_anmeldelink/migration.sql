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
CREATE TABLE "AnmeldungLink" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "accessToken" UUID NOT NULL,
    "unterveranstaltungId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "anmeldungId" INTEGER,

    CONSTRAINT "AnmeldungLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnmeldungLink_anmeldungId_key" ON "AnmeldungLink"("anmeldungId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_FaqToUnterveranstaltung_AB_unique" ON "_FaqToUnterveranstaltung"("A", "B");

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_anmeldungId_fkey" FOREIGN KEY ("anmeldungId") REFERENCES "Anmeldung"("id") ON DELETE SET NULL ON UPDATE CASCADE;
