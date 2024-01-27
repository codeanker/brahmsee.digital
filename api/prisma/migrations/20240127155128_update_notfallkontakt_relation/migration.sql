/*
  Warnings:

  - You are about to drop the `_NotfallkontaktToPerson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `personId` to the `Notfallkontakt` table without a default value. This is not possible if the table is not empty.
  - Made the column `istErziehungsberechtigt` on table `Notfallkontakt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_NotfallkontaktToPerson" DROP CONSTRAINT "_NotfallkontaktToPerson_A_fkey";

-- DropForeignKey
ALTER TABLE "_NotfallkontaktToPerson" DROP CONSTRAINT "_NotfallkontaktToPerson_B_fkey";

-- AlterTable
ALTER TABLE "Notfallkontakt" ADD COLUMN     "personId" INTEGER NOT NULL,
ALTER COLUMN "istErziehungsberechtigt" SET NOT NULL,
ALTER COLUMN "istErziehungsberechtigt" SET DEFAULT false;

-- DropTable
DROP TABLE "_NotfallkontaktToPerson";

-- AddForeignKey
ALTER TABLE "Notfallkontakt" ADD CONSTRAINT "Notfallkontakt_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
