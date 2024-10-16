import express, { Request, Response } from "express";
import {
  ErrorResponse,
  GetLeaderboardEntryRequest,
  GetLeaderboardEntryRequestSchema,
  UpdateLeaderboardEntryRequest,
  UpdateLeaderboardEntryRequestSchema,
  GetLeaderboardPositionRequest,
  GetLeaderboardPositionRequestSchema,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/chip/get_leaderboard_entry
 * @desc Gets the leaderboard entry for a user
 */
router.get(
  "/get_leaderboard_entry",
  async (
    req: Request<{}, {}, GetLeaderboardEntryRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = GetLeaderboardEntryRequestSchema.parse(req.query);
      const { authToken, chipIssuer } = validatedData;

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Get leaderboard entry
      const entry = await controller.GetLeaderboardEntry(user.username, chipIssuer);

      if (entry) {
        return res.status(200).json(entry);
      }

      throw new Error("Failed to get leaderboard entry");
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

/**
 * @route POST /api/user/update_leaderboard_entry
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
      const { authToken, chipIssuer } = validatedData;

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Update leaderboard entry
      await controller.UpdateLeaderboardEntry(user.username, chipIssuer);

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

/**
 * @route GET /api/chip/get_leaderboard_position
 * @desc Gets the leaderboard position for a user
 */
router.get(
  "/get_leaderboard_position",
  async (
    req: Request<{}, {}, GetLeaderboardPositionRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = GetLeaderboardPositionRequestSchema.parse(req.query);
      const { authToken, chipIssuer } = validatedData;

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Get leaderboard position
      const position = await controller.GetUserLeaderboardPosition(user.username, chipIssuer);

      if (position) {
        return res.status(200).json(position);
      }

      throw new Error("Failed to get leaderboard position");
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
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      // Use same schema as /get_leaderboard_entry
      const validatedData = GetLeaderboardEntryRequestSchema.parse(req.query);
      const { authToken, chipIssuer } = validatedData;

      // Fetch user by auth token
      // While the user isn't specifically required, it ensures the request is from an authenticated user
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Get leaderboard entries
      const entries = await controller.GetTopLeaderboard(100, chipIssuer);

      if (entries) {
        return res.status(200).json(entries);
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
