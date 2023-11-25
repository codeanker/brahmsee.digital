/*
  Warnings:

  - You are about to drop the column `bezirkId` on the `Gliederung` table. All the data in the column will be lost.
  - You are about to drop the column `landesverbandId` on the `Gliederung` table. All the data in the column will be lost.
  - You are about to drop the `Bezirk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Landesverband` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bezirk" DROP CONSTRAINT "Bezirk_landesverbandId_fkey";

-- DropForeignKey
ALTER TABLE "Gliederung" DROP CONSTRAINT "Gliederung_bezirkId_fkey";

-- DropForeignKey
ALTER TABLE "Gliederung" DROP CONSTRAINT "Gliederung_landesverbandId_fkey";

-- AlterTable
ALTER TABLE "Gliederung" DROP COLUMN "bezirkId",
DROP COLUMN "landesverbandId";

-- DropTable
DROP TABLE "Bezirk";

-- DropTable
DROP TABLE "Landesverband";
