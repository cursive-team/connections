-- CreateTable
CREATE TABLE "PairConnection" (
    "id" TEXT NOT NULL,
    "usernameA" TEXT NOT NULL,
    "usernameB" TEXT,
    "connectionScore" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PairConnection_pkey" PRIMARY KEY ("id")
);
