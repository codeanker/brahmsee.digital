/*
  Warnings:

  - A unique constraint covering the columns `[veranstaltungId,gliederungId]` on the table `Unterveranstaltung` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unterveranstaltung_veranstaltungId_gliederungId_key" ON "Unterveranstaltung"("veranstaltungId", "gliederungId");
