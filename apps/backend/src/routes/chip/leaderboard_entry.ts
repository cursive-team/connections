import express, { Request, Response } from "express";
import {
  ErrorResponse,
  LeaderboardEntry,
  GetLeaderboardEntryRequest,
  GetLeaderboardEntryRequestSchema,
  UpdateLeaderboardEntryRequest,
  UpdateLeaderboardEntryRequestSchema,
  GetLeaderboardPositionRequest,
  GetLeaderboardPositionRequestSchema,
  LeaderboardDetails,
  LeaderboardEntries,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/chip/update_leaderboard_entry
 * @desc Updates the leaderboard entry for a user
 */
router.post(
  "/update_leaderboard_entry",
  async (
    req: Request<{}, {}, UpdateLeaderboardEntryRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = UpdateLeaderboardEntryRequestSchema.parse(req.body);
      const { authToken, chipIssuer, entryType, entryValue } = validatedData;

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Update leaderboard entry
      await controller.UpdateLeaderboardEntry(
        user.username,
        chipIssuer,
        entryType,
        entryValue
      );

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

/**
 * @route GET /api/chip/get_leaderboard_details
 * @desc Gets the leaderboard details for a user
 */
router.get(
  "/get_leaderboard_details",
  async (
    req: Request<{}, {}, GetLeaderboardPositionRequest>,
    res: Response<LeaderboardDetails | ErrorResponse>
  ) => {
    try {
      const validatedData = GetLeaderboardPositionRequestSchema.parse(
        req.query
      );
      const { authToken, chipIssuer, entryType } = validatedData;

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Get leaderboard position
      const position = await controller.GetUserLeaderboardPosition(
        user.username,
        chipIssuer,
        entryType
      );

      const totalContributors =
        await controller.GetLeaderboardTotalContributors(chipIssuer, entryType);

      const totalValue = await controller.GetLeaderboardTotalValue(
        chipIssuer,
        entryType
      );

      if (
        position === null ||
        totalContributors === null ||
        totalValue === null
      ) {
        throw new Error("Missing values, failed to get leaderboard position");
      }

      const resp: LeaderboardDetails = {
        username: user.username,
        userPosition: position,
        totalContributors,
        totalValue,
      };

      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

/**
 * @route GET /api/chip/get_top_leaderboard_entries
 * @desc Gets the top leaderboard entries for a chip issuer
 */
router.get(
  "/get_top_leaderboard_entries",
  async (
    req: Request<{}, {}, GetLeaderboardEntryRequest>,
    res: Response<LeaderboardEntries | ErrorResponse>
  ) => {
    try {
      // Use same schema as /get_leaderboard_entry
      const validatedData = GetLeaderboardEntryRequestSchema.parse(req.query);
      const { authToken, chipIssuer, entryType, count } = validatedData;

      // Fetch user by auth token
      // While the user isn't specifically required, it ensures the request is from an authenticated user
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      const entries = await controller.GetTopLeaderboardEntries(
        chipIssuer,
        entryType,
        count
      );

      if (entries) {
        return res.status(200).json({ entries: entries });
      }

      throw new Error("Failed to get leaderboard entries");
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
