import express, { Request, Response } from "express";
import {
  ErrorResponse,
  errorToString,
  VerifyEmailUniqueRequest,
  VerifyEmailUniqueRequestSchema,
  VerifyEmailUniqueResponse,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/user/verify_email_unique
 * @desc Verifies if an email is unique
 */
router.post(
  "/verify_email_unique",
  async (
    req: Request<{}, {}, VerifyEmailUniqueRequest>,
    res: Response<VerifyEmailUniqueResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = VerifyEmailUniqueRequestSchema.parse(req.body);
      const { email } = validatedData;

      const existingUser = await controller.GetUserByEmail(email);
      const isUnique = !existingUser;

      return res.status(200).json({ isUnique });
    } catch (error) {
      console.error("Error in verify email unique route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
