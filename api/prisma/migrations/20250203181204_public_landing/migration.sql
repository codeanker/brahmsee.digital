-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_photoId_fkey";

-- CreateTable
CREATE TABLE "faq_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unterveranstaltungId" INTEGER NOT NULL,

    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingSettings" (
    "unterveranstaltungId" SERIAL NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "eventDetailsTitle" TEXT NOT NULL,
    "eventDetailsContent" TEXT NOT NULL,
    "miscellaneousVisible" BOOLEAN,
    "miscellaneousTitle" TEXT,
    "faqVisible" BOOLEAN,
    "faqEmail" TEXT,
    "instagramVisible" BOOLEAN,
    "instagramUrl" TEXT,
    "facebookVisible" BOOLEAN,
    "facebookUrl" TEXT,

    CONSTRAINT "UnterveranstaltungLandingSettings_pkey" PRIMARY KEY ("unterveranstaltungId")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingImages" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "unterveranstaltungLandingSettingsId" INTEGER,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "UnterveranstaltungLandingImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingMiscellaneous" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "unterveranstaltungLandingSettingsId" INTEGER,

    CONSTRAINT "UnterveranstaltungLandingMiscellaneous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FaqToUnterveranstaltung" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FaqToUnterveranstaltung_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "faq_categories_name_unterveranstaltungId_key" ON "faq_categories"("name", "unterveranstaltungId");

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungLandingImages_fileId_key" ON "UnterveranstaltungLandingImages"("fileId");

-- CreateIndex
CREATE INDEX "_FaqToUnterveranstaltung_B_index" ON "_FaqToUnterveranstaltung"("B");

-- AddForeignKey
ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "faq_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingSettings" ADD CONSTRAINT "UnterveranstaltungLandingSettings_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_unterveranstaltungLandingS_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("unterveranstaltungId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingMiscellaneous" ADD CONSTRAINT "UnterveranstaltungLandingMiscellaneous_unterveranstaltungL_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("unterveranstaltungId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_A_fkey" FOREIGN KEY ("A") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_B_fkey" FOREIGN KEY ("B") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
