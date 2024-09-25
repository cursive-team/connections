-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "authenticationTag" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Backup_userId_key" ON "Backup"("userId");

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
