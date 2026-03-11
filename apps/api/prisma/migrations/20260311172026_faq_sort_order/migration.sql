-- AlterTable
ALTER TABLE "faq_categories" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
