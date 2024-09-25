/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Backup` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdatedAt` on the `Backup` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Backup` table. All the data in the column will be lost.
  - You are about to drop the column `passwordSalt` on the `Backup` table. All the data in the column will be lost.
  - You are about to drop the column `sequenceNumber` on the `Backup` table. All the data in the column will be lost.
  - Added the required column `backupEntryType` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientCreatedAt` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordSalt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Backup" DROP COLUMN "createdAt",
DROP COLUMN "lastUpdatedAt",
DROP COLUMN "passwordHash",
DROP COLUMN "passwordSalt",
DROP COLUMN "sequenceNumber",
ADD COLUMN     "backupEntryType" TEXT NOT NULL,
ADD COLUMN     "clientCreatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "passwordSalt" TEXT NOT NULL;
