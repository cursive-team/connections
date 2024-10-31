-- CreateTable
CREATE TABLE "DataHashMatch" (
    "id" TEXT NOT NULL,
    "usernameA" TEXT NOT NULL,
    "usernameB" TEXT NOT NULL,
    "connectionScore" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataHashMatch_pkey" PRIMARY KEY ("id")
);
