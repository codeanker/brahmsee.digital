-- CreateTable
CREATE TABLE "ProgrammPunkt" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startingAt" TIMESTAMP(3) NOT NULL,
    "endingAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "veranstaltungId" INTEGER NOT NULL,

    CONSTRAINT "ProgrammPunkt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgrammPunkt" ADD CONSTRAINT "ProgrammPunkt_veranstaltungId_fkey" FOREIGN KEY ("veranstaltungId") REFERENCES "Veranstaltung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
