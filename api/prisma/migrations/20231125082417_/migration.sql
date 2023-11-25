/*
  Warnings:

  - The `birthday` column on the `Person` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "birthday",
ADD COLUMN     "birthday" DATE;
