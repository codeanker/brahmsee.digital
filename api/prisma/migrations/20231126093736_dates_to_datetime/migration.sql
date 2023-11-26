-- AlterTable
ALTER TABLE "Unterveranstaltung" ALTER COLUMN "meldebeginn" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "meldeschluss" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Veranstaltung" ALTER COLUMN "meldebeginn" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "meldeschluss" SET DATA TYPE TIMESTAMP(3);
