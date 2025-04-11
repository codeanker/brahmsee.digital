-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('OFFEN', 'AKTIV', 'DEAKTIVIERT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GLIEDERUNG_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "Essgewohnheit" AS ENUM ('OMNIVOR', 'VEGETARISCH', 'VEGAN');

-- CreateEnum
CREATE TYPE "NahrungsmittelIntoleranz" AS ENUM ('SCHWEIN', 'GLUTEN', 'LAKTOSE', 'FRUCTOSE');

-- CreateEnum
CREATE TYPE "QualificationFahrerlaubnis" AS ENUM ('B', 'BE', 'C', 'CE', 'D1', 'D', 'D1E', 'DE', 'T', 'L');

-- CreateEnum
CREATE TYPE "QualificationSchwimmer" AS ENUM ('BRONZE', 'SILBER', 'GOLD', 'JUNIORRETTER', 'RETTUNGSSCHWIMMER_BRONZE', 'RETTUNGSSCHWIMMER_SILBER', 'RETTUNGSSCHWIMMER_GOLD');

-- CreateEnum
CREATE TYPE "QualificationErsteHilfe" AS ENUM ('EINWEISER_EHSH', 'AUSBILDER_EHSH_MODUL_1_2', 'AUSBILDER_EHSH_MODUL_3', 'MODULE_1', 'MODULE_2', 'MODULE_3', 'AUSBILDUNG', 'KINDERNOTFAELLE', 'BILDUNGS_UND_BETREUUNGSEINRICHTUNGEN_KINDER', 'AUSBILDER');

-- CreateEnum
CREATE TYPE "QualificationSanitaeter" AS ENUM ('SAN_A', 'SAN_B', 'FORTBILDUNG', 'AUSBILDER');

-- CreateEnum
CREATE TYPE "QualificationFunk" AS ENUM ('DLRG_SPRECHFUNKER', 'BOS_SPRECHFUNKER_ANALOG', 'BOS_SPRECHFUNKER_DIGITAL', 'AUSBILDER_SPRECHFUNK', 'AUSBILDER_BOS_SPRECHFUNK', 'MULTIPLIKATOR_SPRECHFUNK', 'MULTIPLIKATOR_BOS_SPRECHFUNK', 'EINSATZFAEHIGKEIT');

-- CreateEnum
CREATE TYPE "Konfektionsgroesse" AS ENUM ('JUNIOR_98_104', 'JUNIOR_110_116', 'JUNIOR_122_128', 'JUNIOR_134_140', 'JUNIOR_146_152', 'JUNIOR_158_164', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "GliederungAccountRole" AS ENUM ('DELEGATIONSLEITER', 'BETREUER', 'TEILNEHMER');

-- CreateEnum
CREATE TYPE "AnmeldungStatus" AS ENUM ('OFFEN', 'BESTAETIGT', 'STORNIERT', 'ABGELEHNT');

-- CreateEnum
CREATE TYPE "MahlzeitType" AS ENUM ('FRUEHSTUECK', 'MITTAGESSEN', 'ABENDESSEN');

-- CreateEnum
CREATE TYPE "UnterveranstaltungType" AS ENUM ('CREW', 'GLIEDERUNG');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'EMAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('BASIC_INPUT', 'BASIC_TEXT_AREA', 'BASIC_EDITOR', 'BASIC_SWITCH', 'BASIC_CHECKBOX', 'BASIC_INPUT_NUMBER', 'BASIC_RADIO', 'BASIC_SELECT', 'BASIC_DROPDOWN');

-- CreateEnum
CREATE TYPE "CustomFieldPosition" AS ENUM ('PUBLIC_ANMELDUNG', 'INTERN_ANMELDUNG');

-- CreateTable
CREATE TABLE "Hostname" (
    "id" SERIAL NOT NULL,
    "hostname" TEXT NOT NULL,

    CONSTRAINT "Hostname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notfallkontakt" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "istErziehungsberechtigt" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "Notfallkontakt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthday" DATE,
    "gender" "Gender",
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "gliederungId" INTEGER,
    "essgewohnheit" "Essgewohnheit",
    "nahrungsmittelIntoleranzen" "NahrungsmittelIntoleranz"[],
    "weitereIntoleranzen" TEXT[],
    "qualifikationenFahrerlaubnis" "QualificationFahrerlaubnis"[],
    "qualifikationenSchwimmer" "QualificationSchwimmer"[],
    "qualifikationenErsteHilfe" "QualificationErsteHilfe"[],
    "qualifikationenSanitaeter" "QualificationSanitaeter"[],
    "qualifikationenFunk" "QualificationFunk"[],
    "konfektionsgroesse" "Konfektionsgroesse",
    "notfallkontaktIds" INTEGER[],
    "addressId" INTEGER,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "dlrgOauthId" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL,
    "personId" INTEGER NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "activationToken" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'OFFEN',
    "passwordResetToken" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gliederung" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "edv" TEXT NOT NULL,

    CONSTRAINT "Gliederung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GliederungToAccount" (
    "id" SERIAL NOT NULL,
    "gliederungId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "role" "GliederungAccountRole" NOT NULL,

    CONSTRAINT "GliederungToAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anmeldung" (
    "id" SERIAL NOT NULL,
    "unterveranstaltungId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "status" "AnmeldungStatus" NOT NULL DEFAULT 'OFFEN',
    "mahlzeitenIds" INTEGER[],
    "uebernachtungsTage" DATE[],
    "tshirtBestellt" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anmeldung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "Ort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veranstaltung" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "beginn" DATE NOT NULL,
    "ende" DATE NOT NULL,
    "meldebeginn" TIMESTAMP(3) NOT NULL,
    "meldeschluss" TIMESTAMP(3) NOT NULL,
    "ortId" INTEGER,
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,
    "beschreibung" TEXT,
    "datenschutz" TEXT,
    "teilnahmeBedingungen" TEXT,
    "teilnahmeBedingungenPublic" TEXT,
    "zielgruppe" TEXT,
    "hostnameId" INTEGER,

    CONSTRAINT "Veranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahlzeit" (
    "id" SERIAL NOT NULL,
    "type" "MahlzeitType" NOT NULL,
    "date" DATE NOT NULL,
    "veranstaltungId" INTEGER NOT NULL,

    CONSTRAINT "Mahlzeit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unterveranstaltung" (
    "id" SERIAL NOT NULL,
    "maxTeilnehmende" INTEGER NOT NULL,
    "teilnahmegebuehr" INTEGER NOT NULL,
    "meldebeginn" TIMESTAMP(3) NOT NULL,
    "meldeschluss" TIMESTAMP(3) NOT NULL,
    "veranstaltungId" INTEGER NOT NULL,
    "gliederungId" INTEGER NOT NULL,
    "beschreibung" TEXT,
    "bedingungen" TEXT,
    "type" "UnterveranstaltungType" NOT NULL DEFAULT 'GLIEDERUNG',

    CONSTRAINT "Unterveranstaltung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActivityType" NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" INTEGER,
    "causerId" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CustomFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "role" "Role"[],
    "positions" "CustomFieldPosition"[],
    "veranstaltungId" INTEGER,
    "unterveranstaltungId" INTEGER,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldValue" (
    "id" SERIAL NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "fieldId" INTEGER NOT NULL,
    "anmeldungId" INTEGER,

    CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnmeldungToMahlzeit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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
CREATE UNIQUE INDEX "Gliederung_edv_key" ON "Gliederung"("edv");

-- CreateIndex
CREATE UNIQUE INDEX "GliederungToAccount_gliederungId_accountId_key" ON "GliederungToAccount"("gliederungId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE INDEX "_AnmeldungToMahlzeit_B_index" ON "_AnmeldungToMahlzeit"("B");

-- AddForeignKey
ALTER TABLE "Notfallkontakt" ADD CONSTRAINT "Notfallkontakt_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliederungToAccount" ADD CONSTRAINT "GliederungToAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anmeldung" ADD CONSTRAINT "Anmeldung_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ort" ADD CONSTRAINT "Ort_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_ortId_fkey" FOREIGN KEY ("ortId") REFERENCES "Ort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_hostnameId_fkey" FOREIGN KEY ("hostnameId") REFERENCES "Hostname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahlzeit" ADD CONSTRAINT "Mahlzeit_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unterveranstaltung" ADD CONSTRAINT "Unterveranstaltung_gliederungId_fkey" FOREIGN KEY ("gliederungId") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_causerId_fkey" FOREIGN KEY ("causerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_unterveranstaltungId_fkey" FOREIGN KEY ("unterveranstaltungId") REFERENCES "Unterveranstaltung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_anmeldungId_fkey" FOREIGN KEY ("anmeldungId") REFERENCES "Anmeldung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_A_fkey" FOREIGN KEY ("A") REFERENCES "Anmeldung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_B_fkey" FOREIGN KEY ("B") REFERENCES "Mahlzeit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
