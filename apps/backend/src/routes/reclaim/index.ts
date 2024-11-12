import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();


/**
 * @route GET /api/reclaim/
 * @desc Returns the Reclaim URL and status url for the current session
 * @returns { url: string, status: string }
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const redirectUrl = req.query.redirectUrl as string;
    if (!redirectUrl) {
      return res.status(400).json({
        error: "Redirect URL is required",
      });
    }

    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    const user = await controller.GetUserById(userId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid auth token",
      });
    }

    const { url, status } = await controller.GetTwitterReclaimUrl(user.id, redirectUrl);
    return res.json({ url, status });
  } catch (error) {
    console.error("Error generating Twitter Reclaim URL:", error);
    return res.status(500).json({
      error: "Failed to generate Twitter Reclaim URL",
    });
  }
});

/**
 * @route POST /api/reclaim/callback
 * @desc Handles the callback from Reclaim protocol with proof
 * @returns { message: string }
 */
router.post("/callback", async (req: Request, res: Response) => {
  try {
    const { proof } = req.body;
    if (!proof) {
      return res.status(400).json({
        error: "Proof is required",
      });
    }

    const result = await controller.HandleTwitterReclaimCallback(proof);
    return res.json(result);
  } catch (error) {
    console.error("Error handling Twitter Reclaim callback:", error);
    return res.status(500).json({
      error: "Failed to handle Twitter Reclaim callback",
    });
  }
});

export default router;
