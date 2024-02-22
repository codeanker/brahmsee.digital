-- AlterTable
ALTER TABLE "Veranstaltung" ADD COLUMN     "hostnameId" INTEGER;

-- CreateTable
CREATE TABLE "Hostname" (
    "id" SERIAL NOT NULL,
    "hostname" TEXT NOT NULL,

    CONSTRAINT "Hostname_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Veranstaltung" ADD CONSTRAINT "Veranstaltung_hostnameId_fkey" FOREIGN KEY ("hostnameId") REFERENCES "Hostname"("id") ON DELETE SET NULL ON UPDATE CASCADE;
