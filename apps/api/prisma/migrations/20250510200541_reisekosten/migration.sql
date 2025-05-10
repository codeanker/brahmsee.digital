-- CreateEnum
CREATE TYPE "ReisekostenTyp" AS ENUM ('VERANSTALTUNG', 'AUSLAGEN');

-- CreateEnum
CREATE TYPE "ReisekostenTravel" AS ENUM ('CAR', 'PUBLIC_TRANSPORT');

-- CreateTable
CREATE TABLE "Reisekosten" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ReisekostenTyp" NOT NULL,
    "personId" INTEGER NOT NULL,
    "veranstaltungId" INTEGER NOT NULL,
    "travel" "ReisekostenTravel" NOT NULL,
    "licensePlateArrival" TEXT,
    "priceArrival" DOUBLE PRECISION,
    "distanceArrival" DOUBLE PRECISION,
    "routeArrival" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "licensePlateDeparture" TEXT,
    "priceDeparture" DOUBLE PRECISION,
    "distanceDeparture" DOUBLE PRECISION,
    "routeDeparture" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "extraCosts" JSONB[],
    "donation" BOOLEAN NOT NULL,
    "accountHolder" TEXT,
    "iban" TEXT,
    "bic" TEXT,

    CONSTRAINT "Reisekosten_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reisekosten" ADD CONSTRAINT "Reisekosten_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reisekosten" ADD CONSTRAINT "Reisekosten_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
