import express, { Request, Response } from "express";
import {
  ErrorResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserLoginRequestSchema,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/user/login
 * @desc Authenticates a user and returns login information
 */
router.post(
  "/login",
  async (
    req: Request<{}, {}, UserLoginRequest>,
    res: Response<UserLoginResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = UserLoginRequestSchema.parse(req.body);
      const { email, signinToken } = validatedData;

      // Check if the user exists
      const user = await controller.GetUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify the signin token
      const isValid = await controller.VerifySigninToken(
        email,
        signinToken,
        true
      );
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signin token" });
      }

      // Fetch backups for the user
      const backups = await controller.GetAllBackupsForUser(user.id);

      if (backups.length === 0) {
        return res.status(404).json({ error: "No backups found for user" });
      }

      const backupData = backups.map((backup) => ({
        authenticationTag: backup.authenticationTag,
        iv: backup.iv,
        encryptedData: backup.encryptedData,
        backupEntryType: backup.backupEntryType,
        clientCreatedAt: backup.clientCreatedAt,
        submittedAt: backup.submittedAt,
      }));

      // Generate a new auth token for the user
      const authToken = await controller.CreateAuthTokenForUser(user.id);

      return res.status(200).json({
        authToken,
        backupData,
        passwordSalt: user.passwordSalt,
        passwordHash: user.passwordHash,
        registeredWithPasskey: user.registeredWithPasskey,
        passkeyAuthPublicKey: user.passkeyAuthPublicKey ?? undefined,
      });
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
