BEGIN TRANSACTION;

-- CreateTable
CREATE TABLE "VeranstaltungSettings" (
    "veranstaltungId" INTEGER NOT NULL,
    "enablePhotoUpload" BOOLEAN NOT NULL DEFAULT false,
    "enableThshirtOrder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VeranstaltungSettings_pkey" PRIMARY KEY ("veranstaltungId")
);

-- CreateIndex
CREATE UNIQUE INDEX "VeranstaltungSettings_veranstaltungId_key" ON "VeranstaltungSettings"("veranstaltungId");

-- AddForeignKey
ALTER TABLE "VeranstaltungSettings"
ADD CONSTRAINT "VeranstaltungSettings_veranstaltungId_fkey"
    FOREIGN KEY ("veranstaltungId")
    REFERENCES "Veranstaltung"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "VeranstaltungSettings" ("veranstaltungId")
SELECT id
FROM "Veranstaltung" v
WHERE NOT EXISTS (
    SELECT 1
    FROM "VeranstaltungSettings" vs
    WHERE vs."veranstaltungId" = v.id
);

COMMIT;
