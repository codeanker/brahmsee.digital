-- CreateEnum
CREATE TYPE "Essgewohnheit" AS ENUM ('OMNIVORE', 'VEGETARISCH', 'VEGAN');

-- CreateEnum
CREATE TYPE "NahrungsmittelIntoleranz" AS ENUM ('SCHWEIN', 'GLUTEN', 'LAKTOSE', 'FRUCTOSE');

-- CreateEnum
CREATE TYPE "QualificationFahrerlaubnis" AS ENUM ('B', 'BE', 'C', 'CE', 'D1', 'D', 'D1E', 'DE', 'T', 'L');

-- CreateEnum
CREATE TYPE "QualificationSchwimmer" AS ENUM ('BRONZE', 'SILBER', 'GOLD', 'JUNIORRETTER', 'RETTUNGSSCHWIMMER_BRONZE', 'RETTUNGSSCHWIMMER_SILBER', 'RETTUNGSSCHWIMMER_GOLD');

-- CreateEnum
CREATE TYPE "QualificationErsteHilfe" AS ENUM ('MODULE_1', 'MODULE_2', 'MODULE_3', 'AUSBILDUNG', 'KINDERNOTFAELLE', 'BILDUNGS_UND_BETREUUNGSEINRICHTUNGEN_KINDER', 'AUSBILDER');

-- CreateEnum
CREATE TYPE "QualificationSanitaeter" AS ENUM ('SAN_A', 'SAN_B', 'FORTBILDUNG', 'AUSBILDER');

-- CreateEnum
CREATE TYPE "QualificationFunk" AS ENUM ('DLRG_SPRECHFUNKER', 'BOS_SPRECHFUNKER_ANALOG', 'BOS_SPRECHFUNKER_DIGITAL', 'AUSBILDER_SPRECHFUNK', 'AUSBILDER_BOS_SPRECHFUNK', 'MULTIPLIKATOR_SPRECHFUNK', 'MULTIPLIKATOR_BOS_SPRECHFUNK', 'EINSATZFAEHIGKEIT');

-- CreateEnum
CREATE TYPE "Konfektionsgroesse" AS ENUM ('JUNIOR_98_104', 'JUNIOR_110_116', 'JUNIOR_122_128', 'JUNIOR_134_140', 'JUNIOR_146_152', 'JUNIOR_158_164', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "MahlzeitType" AS ENUM ('FRUEHSTUECK', 'MITTAGESSEN', 'ABENDESSEN');

-- AlterTable
ALTER TABLE "Anmeldung" ADD COLUMN     "mahlzeitenIds" INTEGER[],
ADD COLUMN     "uebernachtungsTage" DATE[];

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "essgewohnheit" "Essgewohnheit",
ADD COLUMN     "konfektionsgroesse" "Konfektionsgroesse",
ADD COLUMN     "nahrungsmittelIntoleranzen" "NahrungsmittelIntoleranz"[],
ADD COLUMN     "notfallkontaktIds" INTEGER[],
ADD COLUMN     "qualifikationenErsteHilfe" "QualificationErsteHilfe"[],
ADD COLUMN     "qualifikationenFahrerlaubnis" "QualificationFahrerlaubnis"[],
ADD COLUMN     "qualifikationenFunk" "QualificationFunk"[],
ADD COLUMN     "qualifikationenSanitaeter" "QualificationSanitaeter"[],
ADD COLUMN     "qualifikationenSchwimmer" "QualificationSchwimmer"[],
ADD COLUMN     "weitereIntoleranzen" TEXT[];

-- CreateTable
CREATE TABLE "Notfallkontakt" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "istErziehungsberechtigt" BOOLEAN,

    CONSTRAINT "Notfallkontakt_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_NotfallkontaktToPerson" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AnmeldungToMahlzeit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NotfallkontaktToPerson_AB_unique" ON "_NotfallkontaktToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_NotfallkontaktToPerson_B_index" ON "_NotfallkontaktToPerson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnmeldungToMahlzeit_AB_unique" ON "_AnmeldungToMahlzeit"("A", "B");

-- CreateIndex
CREATE INDEX "_AnmeldungToMahlzeit_B_index" ON "_AnmeldungToMahlzeit"("B");

-- AddForeignKey
ALTER TABLE "Mahlzeit" ADD CONSTRAINT "Mahlzeit_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotfallkontaktToPerson" ADD CONSTRAINT "_NotfallkontaktToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Notfallkontakt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotfallkontaktToPerson" ADD CONSTRAINT "_NotfallkontaktToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_A_fkey" FOREIGN KEY ("A") REFERENCES "Anmeldung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnmeldungToMahlzeit" ADD CONSTRAINT "_AnmeldungToMahlzeit_B_fkey" FOREIGN KEY ("B") REFERENCES "Mahlzeit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
