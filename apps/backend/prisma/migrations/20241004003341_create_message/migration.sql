-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "receiverSignaturePublicKey" TEXT NOT NULL,
    "senderEphemeralEncryptionPublicKey" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "senderEncryptedSignaturePublicKey" TEXT NOT NULL,
    "senderEncryptedSignature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_senderEphemeralEncryptionPublicKey_key" ON "Message"("senderEphemeralEncryptionPublicKey");
