import express, { Request, Response } from "express";
import {
  ErrorResponse,
  errorToString,
  VerifyUsernameUniqueRequest,
  VerifyUsernameUniqueRequestSchema,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/user/verify_username_unique
 * @desc Verifies if a username is unique
 */
router.post(
  "/verify_username_unique",
  async (
    req: Request<{}, {}, VerifyUsernameUniqueRequest>,
    res: Response<{ isUnique: boolean } | ErrorResponse>
  ) => {
    try {
      const validatedData = VerifyUsernameUniqueRequestSchema.parse(req.body);
      const { username } = validatedData;

      const existingUser = await controller.GetUserByUsernameCaseInsensitive(
        username
      );
      const isUnique = !existingUser;

      return res.status(200).json({ isUnique });
    } catch (error) {
      console.error("Error in verify username unique route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
