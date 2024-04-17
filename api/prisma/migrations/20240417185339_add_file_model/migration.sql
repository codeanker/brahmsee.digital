-- CreateEnum
CREATE TYPE "FileProvider" AS ENUM ('LOCAL');

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3),
    "provider" "FileProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "mimetype" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");
