-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "registrationNumber" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "signaturePublicKey" TEXT NOT NULL,
    "encryptionPublicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_registrationNumber_key" ON "User"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
