import express, { Request, Response } from "express";
import {
  ErrorResponse,
  CreateSigninTokenRequest,
  CreateSigninTokenRequestSchema,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/user/get_signin_token
 * @desc Creates a signin token for the provided email and sends it via email
 */
router.get(
  "/get_signin_token",
  async (
    req: Request<{}, {}, {}, CreateSigninTokenRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = CreateSigninTokenRequestSchema.parse(req.query);
      const { email } = validatedData;

      // Create a signin token
      const signinToken = await controller.CreateSigninToken(email);

      // Send the signin token via email
      await controller.EmailSigninToken(signinToken);

      return res.status(200).json({});
    } catch (error) {
      console.error("Error in get signin token route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
