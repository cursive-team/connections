-- CreateTable
CREATE TABLE "UserChip" (
    "id" TEXT NOT NULL,
    "chipIssuer" TEXT NOT NULL,
    "chipId" TEXT NOT NULL,
    "chipVariant" TEXT NOT NULL,
    "chipPublicKey" TEXT,
    "chipPrivateKey" TEXT,
    "chipTapCount" INTEGER NOT NULL,
    "ownerDisplayName" TEXT,
    "ownerBio" TEXT,
    "ownerSignaturePublicKey" TEXT,
    "ownerEncryptionPublicKey" TEXT,
    "ownerUserData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChip_chipId_key" ON "UserChip"("chipId");
