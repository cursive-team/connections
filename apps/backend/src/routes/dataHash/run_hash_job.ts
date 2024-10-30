import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";
import { UpdateDataHash } from "@/lib/controller/postgres/types";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/data_hash/run_hash_job
 * @desc Processes any unhashed data entries by generating their hashes
 */
router.get(
  "/run_hash_job",
  async (
    req: Request,
    res: Response<
      { processedCount: number; failedCount: number } | ErrorResponse
    >
  ) => {
    try {
      // Get all entries that need hashing (where dataHash is null)
      const unhashed = await controller.GetUnhashedDataHashes();
      let processedCount = 0;
      let failedCount = 0;
      // Process each unhashed entry
      const updatedHashes: UpdateDataHash[] = [];
      for (const entry of unhashed) {
        try {
          // Hash the encrypted input using the enclave
          const { inputWithSecretHash, secretHash } =
            await controller.HashWithSecret(entry.encryptedInput);

          // Update the entry with the generated hashes
          updatedHashes.push({
            id: entry.id,
            dataHash: inputWithSecretHash,
            secretHash: secretHash,
          });

          processedCount++;
        } catch (err) {
          console.error(`Failed to process entry ${entry.id}:`, err);
          failedCount++;
          // Continue with next entry even if one fails
          continue;
        }
      }

      await controller.UpdateDataHashes(updatedHashes);

      return res.status(200).json({ processedCount, failedCount });
    } catch (error) {
      console.error("Error in run hash job route:", error);
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
