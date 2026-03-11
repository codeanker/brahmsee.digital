-- AlterTable
ALTER TABLE "faq_categories" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
