/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `Proof` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proof_jobId_key" ON "Proof"("jobId");
