/*
  Warnings:

  - A unique constraint covering the columns `[edv]` on the table `Gliederung` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `landesverbandId` to the `Gliederung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gliederung" ADD COLUMN     "bezirkId" INTEGER,
ADD COLUMN     "landesverbandId" INTEGER NOT NULL,
ALTER COLUMN "edv" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Landesverband" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "edv" TEXT NOT NULL,

    CONSTRAINT "Landesverband_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bezirk" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "edv" TEXT NOT NULL,
    "landesverbandId" INTEGER,

    CONSTRAINT "Bezirk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Landesverband_edv_key" ON "Landesverband"("edv");

-- CreateIndex
CREATE UNIQUE INDEX "Bezirk_edv_key" ON "Bezirk"("edv");

-- CreateIndex
CREATE UNIQUE INDEX "Gliederung_edv_key" ON "Gliederung"("edv");

-- AddForeignKey
ALTER TABLE "Bezirk" ADD CONSTRAINT "Bezirk_landesverbandId_fkey" FOREIGN KEY ("landesverbandId") REFERENCES "Landesverband"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gliederung" ADD CONSTRAINT "Gliederung_landesverbandId_fkey" FOREIGN KEY ("landesverbandId") REFERENCES "Landesverband"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gliederung" ADD CONSTRAINT "Gliederung_bezirkId_fkey" FOREIGN KEY ("bezirkId") REFERENCES "Bezirk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
