import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/data_hash/pair_connection
 * @desc Creates a new pair connection for a user
 */
router.post(
  "/pair_connection",
  async (req: Request, res: Response<{} | ErrorResponse>) => {
    try {
      const authToken = req.body.authToken as string;
      if (!authToken) {
        return res.status(400).json({
          error: "Auth token is required",
        });
      }

      // Get user from auth token
      const user = await controller.GetUserByAuthToken(authToken);
      if (!user) {
        return res.status(401).json({
          error: "Invalid auth token",
        });
      }

      await controller.UpdatePairConnection(user.username);

      return res.status(200).json({});
    } catch (error) {
      console.error("Error creating pair connection:", error);
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

/**
 * @route GET /api/data_hash/pair_connection
 * @desc Gets the state and score of a pair connection
 */
router.get(
  "/pair_connection",
  async (
    req: Request,
    res: Response<
      { state: string; score?: number; createdAt?: Date } | ErrorResponse
    >
  ) => {
    try {
      const latestPairConnection = await controller.GetLatestPairConnection();

      let state = "pending";
      let score = undefined;

      if (latestPairConnection) {
        if (latestPairConnection.usernameB) {
          state = "complete";
          score = latestPairConnection.connectionScore || undefined;
        } else {
          state = "waiting";
        }
      }

      return res.status(200).json({
        state,
        score,
        createdAt: latestPairConnection?.createdAt,
      });
    } catch (error) {
      console.error("Error getting pair connection:", error);
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
