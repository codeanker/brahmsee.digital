-- AlterTable
ALTER TABLE "AnmeldungLink" ALTER COLUMN "accessToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Veranstaltung" ALTER COLUMN "publicReadToken" DROP DEFAULT;
