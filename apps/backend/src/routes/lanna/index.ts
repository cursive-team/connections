import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/lanna/cherry_otp
 * @desc Get a Cherry OTP for a user
 */
router.get(
  "/cherry_otp",
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

      // Make a GET request to Cherry API using fetch
      const cherryResponse = await fetch(
        `https://cherry.builders/api/external/events/cursive/lanna-2024?user-identifier=${user.id}`,
        {
          headers: {
            "x-api-key": process.env.CHERRY_API_KEY || "",
          },
        }
      );
      if (!cherryResponse.ok) {
        throw new Error(
          `Cherry API responded with status: ${cherryResponse.status}`
        );
      }

      // check if they've already consumed the passcode
      const { passcode, event_slug, consumed } = await cherryResponse.json();
      if (consumed) {
        return res.redirect(`http://cherry.builders`);
      }

      // Construct the verification URL and redirect the user
      const verificationUrl = `http://cherry.builders/verify/event?passcode=${passcode}&event-slug=${event_slug}`;
      return res.redirect(verificationUrl);
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
