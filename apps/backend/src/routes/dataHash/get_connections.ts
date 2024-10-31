import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/data_hash/get_connections
 * @desc Gets all connections for a user based on their auth token
 */
router.get(
  "/get_connections",
  async (
    req: Request,
    res: Response<
      | {
          connections: Array<{
            username: string;
            displayName: string | null;
            notificationUsername: string | null;
            score: number;
          }>;
        }
      | ErrorResponse
    >
  ) => {
    try {
      const authToken = req.query.authToken as string;
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

      // Get all matches
      const matches = await controller.GetAllDataHashMatches();

      // Filter matches for this user and get connected user details
      const userConnections = await Promise.all(
        matches
          .filter(
            (match) =>
              match.usernameA === user.username ||
              match.usernameB === user.username
          )
          .map(async (match) => {
            const username =
              match.usernameA === user.username
                ? match.usernameB
                : match.usernameA;

            const displayName =
              match.usernameA === user.username
                ? match.displayNameB
                : match.displayNameA;

            const notificationUsername =
              match.usernameA === user.username
                ? match.notificationUsernameB
                : match.notificationUsernameA;

            return {
              username,
              displayName,
              notificationUsername,
              score: Number(match.connectionScore),
            };
          })
      );

      return res.status(200).json({ connections: userConnections });
    } catch (error) {
      console.error("Error in get connections route:", error);
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
