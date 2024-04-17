/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UnterveranstaltungDocument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unterveranstaltungId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "UnterveranstaltungDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungDocument_fileId_key" ON "UnterveranstaltungDocument"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
