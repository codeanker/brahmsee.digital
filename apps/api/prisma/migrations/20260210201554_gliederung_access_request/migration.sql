-- AlterTable
ALTER TABLE "GliederungToAccount" ADD COLUMN     "confirmByGliederungToken" TEXT,
ADD COLUMN     "confirmedByGliederung" BOOLEAN NOT NULL DEFAULT false;
