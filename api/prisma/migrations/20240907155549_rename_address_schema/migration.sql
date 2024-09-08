/*
  Warnings:

  - You are about to drop the column `number` on the `Address` table. All the data in the column will be lost.
  - Added the required column `streetNumber` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "number",
ADD COLUMN     "lat" TEXT,
ADD COLUMN     "lon" TEXT,
ADD COLUMN     "streetNumber" TEXT NOT NULL;
