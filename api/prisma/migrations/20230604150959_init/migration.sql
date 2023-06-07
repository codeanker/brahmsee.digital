-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GLIEDERUNG_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gliederung" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Gliederung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anmeldung" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Anmeldung_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
