-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QualificationErsteHilfe" ADD VALUE 'EINWEISER_EHSH';
ALTER TYPE "QualificationErsteHilfe" ADD VALUE 'AUSBILDER_EHSH_MODUL_1_2';
ALTER TYPE "QualificationErsteHilfe" ADD VALUE 'AUSBILDER_EHSH_MODUL_3';
