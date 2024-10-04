import express, { Request, Response } from "express";
import {
  VerifySigninTokenRequest,
  ErrorResponse,
  errorToString,
  VerifySigninTokenRequestSchema,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/user/verify_signin_token
 * @desc Verifies a signin token for the provided email
 */
router.post(
  "/verify_signin_token",
  async (
    req: Request<{}, {}, VerifySigninTokenRequest>,
    res: Response<{ success: boolean } | ErrorResponse>
  ) => {
    try {
      const validatedData = VerifySigninTokenRequestSchema.parse(req.body);
      const { email, signinToken } = validatedData;

      const isValid = await controller.VerifySigninToken(
        email,
        signinToken,
        false
      );

      return res.status(200).json({ success: isValid });
    } catch (error) {
      console.error("Error in verify signin token route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
