-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'OTHER');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActivityType" NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" INTEGER,
    "causerId" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_causerId_fkey" FOREIGN KEY ("causerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
