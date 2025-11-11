-- AlterTable
ALTER TABLE "Veranstaltung" ALTER COLUMN "publicReadToken" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Kreditinstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "blz" INTEGER NOT NULL,
    "bic" TEXT NOT NULL,
    "pan" TEXT NOT NULL,

    CONSTRAINT "Kreditinstitute_pkey" PRIMARY KEY ("id")
);
