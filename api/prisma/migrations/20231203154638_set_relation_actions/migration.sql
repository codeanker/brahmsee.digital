-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_personId_fkey";

-- DropForeignKey
ALTER TABLE "Anmeldung" DROP CONSTRAINT "Anmeldung_personId_fkey";

-- DropForeignKey
ALTER TABLE "Anmeldung" DROP CONSTRAINT "Anmeldung_unterveranstaltungId_fkey";

-- DropForeignKey
ALTER TABLE "GliederungToAccount" DROP CONSTRAINT "GliederungToAccount_accountId_fkey";

-- DropForeignKey
ALTER TABLE "GliederungToAccount" DROP CONSTRAINT "GliederungToAccount_gliederungId_fkey";

-- DropForeignKey
ALTER TABLE "Mahlzeit" DROP CONSTRAINT "Mahlzeit_veranstaltungId_fkey";

-- DropForeignKey
ALTER TABLE "Unterveranstaltung" DROP CONSTRAINT "Unterveranstaltung_gliederungId_fkey";

-- DropForeignKey
ALTER TABLE "Unterveranstaltung" DROP CONSTRAINT "Unterveranstaltung_veranstaltungId_fkey";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahlzeit" ADD CONSTRAINT "Mahlzeit_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
