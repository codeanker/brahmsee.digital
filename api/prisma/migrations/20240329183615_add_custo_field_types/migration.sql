/*
  Warnings:

  - Changed the type of `type` on the `CustomField` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('BASIC_INPUT', 'BASIC_TEXT_AREA', 'BASIC_EDITOR', 'BASIC_SWITCH', 'BASIC_CHECKBOX', 'BASIC_INPUT_NUMBER', 'BASIC_RADIO', 'BASIC_SELECT', 'BASIC_DROPDOWN');

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "type",
ADD COLUMN     "type" "CustomFieldType" NOT NULL,
ALTER COLUMN "required" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomFieldValue" ALTER COLUMN "anmeldungId" DROP NOT NULL;
