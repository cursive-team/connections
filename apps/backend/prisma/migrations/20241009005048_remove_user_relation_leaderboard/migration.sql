/*
  Warnings:

  - You are about to drop the column `userId` on the `LeaderboardEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_userId_fkey";

-- AlterTable
ALTER TABLE "LeaderboardEntry" DROP COLUMN "userId";
