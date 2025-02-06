-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "photoId" TEXT;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
