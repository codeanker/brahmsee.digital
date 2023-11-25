-- AlterTable
ALTER TABLE "Gliederung" ADD COLUMN     "adminIds" INTEGER[];

-- CreateTable
CREATE TABLE "_AccountToGliederung" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToGliederung_AB_unique" ON "_AccountToGliederung"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToGliederung_B_index" ON "_AccountToGliederung"("B");

-- AddForeignKey
ALTER TABLE "_AccountToGliederung" ADD CONSTRAINT "_AccountToGliederung_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToGliederung" ADD CONSTRAINT "_AccountToGliederung_B_fkey" FOREIGN KEY ("B") REFERENCES "Gliederung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
