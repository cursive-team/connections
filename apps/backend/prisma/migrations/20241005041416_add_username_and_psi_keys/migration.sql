/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `psiPublicKeyLink` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chip" ADD COLUMN     "ownerPsiPublicKeyLink" TEXT,
ADD COLUMN     "ownerUsername" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "psiPublicKeyLink" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
