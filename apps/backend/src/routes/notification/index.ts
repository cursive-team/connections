import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/notification/telegram/link
 * @desc Redirect to Telegram to link account
 */
router.get(
  "/telegram/link",
  async (
    req: Request<
      {},
      {},
      {
        authToken: string;
      }
    >,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const { authToken } = req.query;
      if (!authToken) {
        return res.status(400).json({ error: "Missing auth token" });
      }

      // Fetch user by auth token
      const user = await controller.GetUserByAuthToken(authToken.toString());
      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      const botUsername =
        process.env.TELEGRAM_BOT_USERNAME ?? "CurtisCursiveBot";

      const botLink = `https://t.me/${botUsername}?start=${user.id}`;
      return res.redirect(botLink);
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
