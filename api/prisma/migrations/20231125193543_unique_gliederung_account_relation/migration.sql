/*
  Warnings:

  - A unique constraint covering the columns `[gliederungId,accountId]` on the table `GliederungToAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GliederungToAccount_gliederungId_accountId_key" ON "GliederungToAccount"("gliederungId", "accountId");
