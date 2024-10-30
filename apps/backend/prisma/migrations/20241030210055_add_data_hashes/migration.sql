-- CreateTable
CREATE TABLE "PrivateDataHash" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chipIssuer" TEXT,
    "locationId" TEXT,
    "dataIdentifier" TEXT NOT NULL,
    "encryptedInput" TEXT NOT NULL,
    "enclavePublicKey" TEXT NOT NULL,
    "dataHash" TEXT,
    "secretHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateDataHash_pkey" PRIMARY KEY ("id")
);
