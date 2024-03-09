-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('TEXT', 'INT', 'FLOAT', 'BOOLEAN');

-- CreateTable
CREATE TABLE "CustomField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CustomFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL,
    "veranstaltungId" INTEGER,
    "unterveranstaltungId" INTEGER,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomField_name_veranstaltungId_key" ON "CustomField"("name", "veranstaltungId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomField_name_unterveranstaltungId_key" ON "CustomField"("name", "unterveranstaltungId");

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
