/*
  Warnings:

  - You are about to drop the column `adminIds` on the `Gliederung` table. All the data in the column will be lost.
  - You are about to drop the `_AccountToGliederung` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GliederungAccountRole" AS ENUM ('DELIGATIONSLEITER', 'BETREUER', 'TEILNEHMER');

-- DropForeignKey
ALTER TABLE "_AccountToGliederung" DROP CONSTRAINT "_AccountToGliederung_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToGliederung" DROP CONSTRAINT "_AccountToGliederung_B_fkey";

-- AlterTable
ALTER TABLE "Gliederung" DROP COLUMN "adminIds";

-- DropTable
DROP TABLE "_AccountToGliederung";

-- CreateTable
CREATE TABLE "GliederungToAccount" (
    "id" SERIAL NOT NULL,
    "gliederungId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "role" "GliederungAccountRole" NOT NULL,

    CONSTRAINT "GliederungToAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
