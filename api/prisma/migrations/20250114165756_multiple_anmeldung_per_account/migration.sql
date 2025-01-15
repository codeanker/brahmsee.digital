/*
  Warnings:

  - Added the required column `accountId` to the `Anmeldung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anmeldung" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnmeldungToMahlzeit_AB_unique";

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
