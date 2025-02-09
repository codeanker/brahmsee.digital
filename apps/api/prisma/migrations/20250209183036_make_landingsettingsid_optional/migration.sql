-- AlterTable
ALTER TABLE "Unterveranstaltung" ALTER COLUMN "landingSettingsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnmeldungToMahlzeit_AB_unique";

-- AlterTable
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FaqToUnterveranstaltung_AB_unique";
