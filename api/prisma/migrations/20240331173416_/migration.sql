/*
  Warnings:

  - You are about to drop the column `personId` on the `CustomField` table. All the data in the column will be lost.
  - The `value` column on the `CustomFieldValue` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "CustomField" DROP CONSTRAINT "CustomField_personId_fkey";

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "personId";

-- AlterTable
ALTER TABLE "CustomFieldValue" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL DEFAULT '{}';
