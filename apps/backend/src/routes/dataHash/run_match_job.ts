import express, { Request, Response } from "express";
import { ChipIssuer, ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";
import { computeConnectionScore } from "@/lib/util/connectionScore";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/data_hash/run_match_job
 * @desc Processes data hash entries to find matches between users
 */
router.get(
  "/run_match_job",
  async (
    req: Request,
    res: Response<{ userCount: number; matchCount: number } | ErrorResponse>
  ) => {
    try {
      const LANNA_HALLOWEEN_CONNECTION_SCORE_THRESHOLD = Number(
        process.env.LANNA_HALLOWEEN_CONNECTION_SCORE_THRESHOLD!
      );
      const LANNA_HALLOWEEN_CHIP_ISSUER = ChipIssuer.EDGE_CITY_LANNA;
      const LANNA_HALLOWEEN_LOCATION_ID =
        process.env.LANNA_HALLOWEEN_LOCATION_ID!;

      // Get all data hash entries that need matching
      const userHashes = await controller.GetAllUserHashesByChipAndLocation(
        LANNA_HALLOWEEN_CHIP_ISSUER,
        LANNA_HALLOWEEN_LOCATION_ID
      );

      // Get all existing data hash matches
      const existingMatches = await controller.GetAllDataHashMatches();

      // Sort usernames alphabetically
      const sortedUsernames = Object.keys(userHashes).sort();
      let matchCount = 0;
      // Process each pair of users exactly once by using indexes
      for (let i = 0; i < sortedUsernames.length - 1; i++) {
        const userA = sortedUsernames[i];
        const userAHashes = [...new Set(userHashes[userA])];
        const userAHashCount = userAHashes.length;

        for (let j = i + 1; j < sortedUsernames.length; j++) {
          const userB = sortedUsernames[j];

          // Skip if match already exists
          const matchExists = existingMatches.some(
            (match) =>
              (match.usernameA === userA && match.usernameB === userB) ||
              (match.usernameA === userB && match.usernameB === userA)
          );
          if (matchExists) continue;

          const userBHashes = [...new Set(userHashes[userB])];
          const userBHashCount = userBHashes.length;
          const commonHashCount = userAHashes.filter((hashA) =>
            userBHashes.includes(hashA)
          ).length;

          const connectionScore = computeConnectionScore(
            userAHashCount,
            userBHashCount,
            commonHashCount
          );

          if (connectionScore >= LANNA_HALLOWEEN_CONNECTION_SCORE_THRESHOLD) {
            await controller.CreateDataHashMatch(userA, userB, connectionScore);
            // TODO: Notify users of match
            matchCount++;
          }
        }
      }

      return res
        .status(200)
        .json({ userCount: Object.keys(userHashes).length, matchCount });
    } catch (error) {
      console.error("Error in run match job route:", error);
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
