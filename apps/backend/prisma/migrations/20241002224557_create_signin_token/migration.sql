-- CreateTable
CREATE TABLE "SigninToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SigninToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SigninToken_value_key" ON "SigninToken"("value");
