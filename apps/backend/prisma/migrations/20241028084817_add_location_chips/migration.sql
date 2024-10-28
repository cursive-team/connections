/*
  Warnings:

  - A unique constraint covering the columns `[locationId]` on the table `Chip` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chip" ADD COLUMN     "isLocationChip" BOOLEAN,
ADD COLUMN     "locationData" JSONB,
ADD COLUMN     "locationDescription" TEXT,
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "locationName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chip_locationId_key" ON "Chip"("locationId");
