import express, { Request, Response } from "express";
import {
  ErrorResponse,
  UpdateLeaderboardEntryRequest,
  UpdateLeaderboardEntryRequestSchema,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

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

export default router;
