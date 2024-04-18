-- CreateEnum
CREATE TYPE "FileProvider" AS ENUM ('LOCAL', 'AZURE');

-- CreateTable
CREATE TABLE "UnterveranstaltungDocument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unterveranstaltungId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "UnterveranstaltungDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3),
    "provider" "FileProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT,
    "mimetype" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungDocument_fileId_key" ON "UnterveranstaltungDocument"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
