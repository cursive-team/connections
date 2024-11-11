-- CreateTable
CREATE TABLE "Proof" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobCompleted" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "sigNullifier" TEXT,
    "pubkeyNullifier" TEXT,
    "pubkeyNullifierRandomnessHash" TEXT,
    "leaderboardEntryType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proof_pkey" PRIMARY KEY ("id")
);
