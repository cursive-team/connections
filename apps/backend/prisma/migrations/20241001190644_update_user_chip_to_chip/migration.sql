/*
  Warnings:

  - You are about to drop the `UserChip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserChip";

-- CreateTable
CREATE TABLE "Chip" (
    "id" TEXT NOT NULL,
    "chipIssuer" TEXT NOT NULL,
    "chipId" TEXT NOT NULL,
    "chipVariant" TEXT NOT NULL,
    "chipIsRegistered" BOOLEAN NOT NULL DEFAULT false,
    "chipPublicKey" TEXT,
    "chipPrivateKey" TEXT,
    "chipTapCount" INTEGER NOT NULL DEFAULT 0,
    "ownerDisplayName" TEXT,
    "ownerBio" TEXT,
    "ownerSignaturePublicKey" TEXT,
    "ownerEncryptionPublicKey" TEXT,
    "ownerUserData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chip_chipId_key" ON "Chip"("chipId");
