-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN     "entryType" TEXT,
ADD COLUMN     "entryValue" DECIMAL(65,30),
ALTER COLUMN "tapCount" DROP NOT NULL;
