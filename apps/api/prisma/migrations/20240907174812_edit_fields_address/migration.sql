/*
  Warnings:

  - The `lat` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lon` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "lat",
ADD COLUMN     "lat" DOUBLE PRECISION,
DROP COLUMN "lon",
ADD COLUMN     "lon" DOUBLE PRECISION;
