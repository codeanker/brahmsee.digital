/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `personId` to the `Anmeldung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unterveranstaltungId` to the `Anmeldung` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnmeldungStatus" AS ENUM ('OFFEN', 'ANGENOMMEN', 'STORNIERT', 'ABGELEHNT');

-- AlterTable
ALTER TABLE "Anmeldung" ADD COLUMN     "personId" INTEGER NOT NULL,
ADD COLUMN     "status" "AnmeldungStatus" NOT NULL DEFAULT 'OFFEN',
ADD COLUMN     "unterveranstaltungId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthday" TEXT,
    "gender" "Gender",
    "accountId" INTEGER NOT NULL,
    "gliederungId" INTEGER,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veranstaltung" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "beginn" DATE NOT NULL,
    "ende" DATE NOT NULL,
    "meldebeginn" DATE NOT NULL,
    "meldeschluss" DATE NOT NULL,
    "ort" TEXT NOT NULL DEFAULT 'Brahmsee',
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,

    CONSTRAINT "Veranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unterveranstaltung" (
    "id" SERIAL NOT NULL,
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,
    "meldebeginn" DATE NOT NULL,
    "meldeschluss" DATE NOT NULL,
    "veranstaltungId" INTEGER NOT NULL,
    "gliederungId" INTEGER NOT NULL,

    CONSTRAINT "Unterveranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_accountId_key" ON "Person"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
