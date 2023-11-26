/*
  Warnings:

  - You are about to drop the column `ort` on the `Veranstaltung` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "addressId" INTEGER;

-- AlterTable
ALTER TABLE "Veranstaltung" DROP COLUMN "ort",
ADD COLUMN     "ortId" INTEGER;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "Ort_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ort" ADD CONSTRAINT "Ort_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_ortId_fkey" FOREIGN KEY ("ortId") REFERENCES "Ort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
