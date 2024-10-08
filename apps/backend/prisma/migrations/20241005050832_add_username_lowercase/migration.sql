/*
  Warnings:

  - A unique constraint covering the columns `[usernameLowercase]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameLowercase` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "usernameLowercase" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_usernameLowercase_key" ON "User"("usernameLowercase");
