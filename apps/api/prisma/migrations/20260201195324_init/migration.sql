-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GLIEDERUNG_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('OFFEN', 'AKTIV', 'DEAKTIVIERT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'EMAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "AnmeldungStatus" AS ENUM ('OFFEN', 'BESTAETIGT', 'STORNIERT', 'ABGELEHNT');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('BASIC_INPUT', 'BASIC_TEXT_AREA', 'BASIC_EDITOR', 'BASIC_SWITCH', 'BASIC_CHECKBOX', 'BASIC_INPUT_NUMBER', 'BASIC_RADIO', 'BASIC_SELECT', 'BASIC_DROPDOWN');

-- CreateEnum
CREATE TYPE "CustomFieldPosition" AS ENUM ('PUBLIC_ANMELDUNG', 'INTERN_ANMELDUNG');

-- CreateEnum
CREATE TYPE "FileProvider" AS ENUM ('LOCAL', 'AZURE');

-- CreateEnum
CREATE TYPE "GliederungAccountRole" AS ENUM ('DELEGATIONSLEITER', 'BETREUER', 'TEILNEHMER');

-- CreateEnum
CREATE TYPE "MahlzeitType" AS ENUM ('FRUEHSTUECK', 'MITTAGESSEN', 'ABENDESSEN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "Essgewohnheit" AS ENUM ('OMNIVOR', 'VEGETARISCH', 'VEGAN');

-- CreateEnum
CREATE TYPE "NahrungsmittelIntoleranz" AS ENUM ('SCHWEIN', 'GLUTEN', 'LAKTOSE', 'FRUCTOSE');

-- CreateEnum
CREATE TYPE "UnterveranstaltungType" AS ENUM ('CREW', 'GLIEDERUNG');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dlrgOauthId" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL,
    "personId" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "activationToken" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'OFFEN',
    "passwordResetToken" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActivityType" NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "causerId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ort" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" TEXT,

    CONSTRAINT "Ort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anmeldung" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AnmeldungStatus" NOT NULL DEFAULT 'OFFEN',
    "comment" TEXT,
    "accessToken" UUID,
    "assignmentCode" UUID,
    "unterveranstaltungId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "accountId" TEXT,
    "mahlzeitenIds" TEXT[],
    "uebernachtungsTage" DATE[],

    CONSTRAINT "Anmeldung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnmeldungLink" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "comment" TEXT,
    "accessToken" UUID,
    "unterveranstaltungId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "anmeldungId" TEXT,

    CONSTRAINT "AnmeldungLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CustomFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "role" "Role"[],
    "positions" "CustomFieldPosition"[],
    "veranstaltungId" TEXT,
    "unterveranstaltungId" TEXT,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldValue" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "fieldId" TEXT NOT NULL,
    "anmeldungId" TEXT,

    CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unterveranstaltungId" TEXT NOT NULL,

    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3),
    "provider" "FileProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT,
    "mimetype" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gliederung" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edv" TEXT NOT NULL,

    CONSTRAINT "Gliederung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GliederungToAccount" (
    "id" SERIAL NOT NULL,
    "gliederungId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "role" "GliederungAccountRole" NOT NULL,

    CONSTRAINT "GliederungToAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostname" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,

    CONSTRAINT "Hostname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kreditinstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "blz" INTEGER NOT NULL,
    "bic" TEXT NOT NULL,
    "pan" TEXT NOT NULL,

    CONSTRAINT "Kreditinstitute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahlzeit" (
    "id" TEXT NOT NULL,
    "type" "MahlzeitType" NOT NULL,
    "date" DATE NOT NULL,
    "veranstaltungId" TEXT NOT NULL,

    CONSTRAINT "Mahlzeit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthday" DATE,
    "gender" "Gender",
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "gliederungId" TEXT,
    "essgewohnheit" "Essgewohnheit",
    "nahrungsmittelIntoleranzen" "NahrungsmittelIntoleranz"[],
    "weitereIntoleranzen" TEXT[],
    "notfallkontaktIds" INTEGER[],
    "addressId" TEXT,
    "photoId" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notfallkontakt" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "istErziehungsberechtigt" BOOLEAN NOT NULL DEFAULT false,
    "personId" TEXT NOT NULL,

    CONSTRAINT "Notfallkontakt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammPunkt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startingAt" TIMESTAMP(3) NOT NULL,
    "endingAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "veranstaltungId" TEXT NOT NULL,

    CONSTRAINT "ProgrammPunkt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingSettings" (
    "unterveranstaltungId" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "eventDetailsTitle" TEXT NOT NULL,
    "eventDetailsContent" TEXT NOT NULL,
    "miscellaneousVisible" BOOLEAN,
    "miscellaneousTitle" TEXT,
    "miscellaneousSubtitle" TEXT,
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
    "id" TEXT NOT NULL,
    "name" TEXT,
    "unterveranstaltungLandingSettingsId" TEXT,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "UnterveranstaltungLandingImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungLandingMiscellaneous" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "unterveranstaltungLandingSettingsId" TEXT,

    CONSTRAINT "UnterveranstaltungLandingMiscellaneous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unterveranstaltung" (
    "id" TEXT NOT NULL,
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,
    "meldebeginn" TIMESTAMP(3) NOT NULL,
    "meldeschluss" TIMESTAMP(3) NOT NULL,
    "veranstaltungId" TEXT NOT NULL,
    "gliederungId" TEXT NOT NULL,
    "beschreibung" TEXT,
    "bedingungen" TEXT,
    "type" "UnterveranstaltungType" NOT NULL DEFAULT 'GLIEDERUNG',

    CONSTRAINT "Unterveranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnterveranstaltungDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unterveranstaltungId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "UnterveranstaltungDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veranstaltung" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beginn" DATE NOT NULL,
    "ende" DATE NOT NULL,
    "meldebeginn" TIMESTAMP(3) NOT NULL,
    "meldeschluss" TIMESTAMP(3) NOT NULL,
    "ortId" TEXT,
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,
    "beschreibung" TEXT,
    "datenschutz" TEXT,
    "teilnahmeBedingungen" TEXT,
    "teilnahmeBedingungenPublic" TEXT,
    "zielgruppe" TEXT,
    "hostnameId" TEXT,
    "publicReadToken" TEXT,

    CONSTRAINT "Veranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnmeldungToMahlzeit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FaqToUnterveranstaltung" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_dlrgOauthId_key" ON "Account"("dlrgOauthId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_personId_key" ON "Account"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_activationToken_key" ON "Account"("activationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Account_passwordResetToken_key" ON "Account"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "AnmeldungLink_anmeldungId_key" ON "AnmeldungLink"("anmeldungId");

-- CreateIndex
CREATE UNIQUE INDEX "faq_categories_name_unterveranstaltungId_key" ON "faq_categories"("name", "unterveranstaltungId");

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Gliederung_edv_key" ON "Gliederung"("edv");

-- CreateIndex
CREATE UNIQUE INDEX "GliederungToAccount_gliederungId_accountId_key" ON "GliederungToAccount"("gliederungId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungLandingImages_fileId_key" ON "UnterveranstaltungLandingImages"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "UnterveranstaltungDocument_fileId_key" ON "UnterveranstaltungDocument"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Veranstaltung_publicReadToken_key" ON "Veranstaltung"("publicReadToken");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE INDEX "_AnmeldungToMahlzeit_B_index" ON "_AnmeldungToMahlzeit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FaqToUnterveranstaltung_AB_unique" ON "_FaqToUnterveranstaltung"("A", "B");

-- CreateIndex
CREATE INDEX "_FaqToUnterveranstaltung_B_index" ON "_FaqToUnterveranstaltung"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_causerId_fkey" FOREIGN KEY ("causerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ort" ADD CONSTRAINT "Ort_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnmeldungLink" ADD CONSTRAINT "AnmeldungLink_anmeldungId_fkey" FOREIGN KEY ("anmeldungId") REFERENCES "Anmeldung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_anmeldungId_fkey" FOREIGN KEY ("anmeldungId") REFERENCES "Anmeldung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "faq_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahlzeit" ADD CONSTRAINT "Mahlzeit_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notfallkontakt" ADD CONSTRAINT "Notfallkontakt_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammPunkt" ADD CONSTRAINT "ProgrammPunkt_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingSettings" ADD CONSTRAINT "UnterveranstaltungLandingSettings_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_unterveranstaltungLandingS_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("unterveranstaltungId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingImages" ADD CONSTRAINT "UnterveranstaltungLandingImages_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungLandingMiscellaneous" ADD CONSTRAINT "UnterveranstaltungLandingMiscellaneous_unterveranstaltungL_fkey" FOREIGN KEY ("unterveranstaltungLandingSettingsId") REFERENCES "UnterveranstaltungLandingSettings"("unterveranstaltungId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnterveranstaltungDocument" ADD CONSTRAINT "UnterveranstaltungDocument_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_ortId_fkey" FOREIGN KEY ("ortId") REFERENCES "Ort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_hostnameId_fkey" FOREIGN KEY ("hostnameId") REFERENCES "Hostname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_A_fkey" FOREIGN KEY ("A") REFERENCES "Anmeldung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_B_fkey" FOREIGN KEY ("B") REFERENCES "Mahlzeit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_A_fkey" FOREIGN KEY ("A") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FaqToUnterveranstaltung" ADD CONSTRAINT "_FaqToUnterveranstaltung_B_fkey" FOREIGN KEY ("B") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
