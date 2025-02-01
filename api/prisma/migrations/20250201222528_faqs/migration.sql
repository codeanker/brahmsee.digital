-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_photoId_fkey";

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FaqToUnterveranstaltung" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FaqToUnterveranstaltung_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FaqToUnterveranstaltung_B_index" ON "_FaqToUnterveranstaltung"("B");

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_A_fkey" FOREIGN KEY ("A") REFERENCES "Faq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_B_fkey" FOREIGN KEY ("B") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
