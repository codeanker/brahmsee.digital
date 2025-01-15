-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "subjectId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnmeldungToMahlzeit_AB_unique";
