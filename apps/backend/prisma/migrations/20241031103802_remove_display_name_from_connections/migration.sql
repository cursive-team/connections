/*
  Warnings:

  - You are about to drop the column `displayNameA` on the `DataHashMatch` table. All the data in the column will be lost.
  - You are about to drop the column `displayNameB` on the `DataHashMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataHashMatch" DROP COLUMN "displayNameA",
DROP COLUMN "displayNameB";
