-- AlterTable
ALTER TABLE "Veranstaltung" ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnmeldungToMahlzeit_AB_unique";
