import express, { Request, Response } from "express";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserRegisterRequestSchema,
  errorToString,
  BackupData,
} from "@types";

const router = express.Router();

import {Controller} from "@/lib/controller";

const controller = new Controller();

/**
 * @route POST /api/user/register
 * @desc Registers a new user with the provided email, public keys, and password information.
 */
router.post(
  "/register",
  async (
    req: Request<{}, {}, UserRegisterRequest>,
    res: Response<UserRegisterResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = UserRegisterRequestSchema.parse(req.body);

      const {
        email,
        signaturePublicKey,
        encryptionPublicKey,
        passwordSalt,
        passwordHash,
        authenticationTag,
        iv,
        encryptedData,
        backupEntryType,
        clientCreatedAt,
      } = validatedData;

      // Check if the user already exists by email
      const existingUser = await controller.GetUserByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const newUser = await controller.CreateUser({
        email,
        signaturePublicKey,
        encryptionPublicKey,
        passwordSalt,
        passwordHash,
      });

      const backup = await controller.CreateBackup({
        user: { connect: { id: newUser.id } },
        authenticationTag,
        iv,
        encryptedData,
        backupEntryType,
        clientCreatedAt,
      });

      const returnedBackupData: BackupData[] = [
        {
          authenticationTag: backup.authenticationTag,
          iv: backup.iv,
          encryptedData: backup.encryptedData,
          backupEntryType: backup.backupEntryType,
          clientCreatedAt: backup.clientCreatedAt,
          submittedAt: backup.submittedAt,
        },
      ];

      // Generate a new auth token for the user
      const authToken = await controller.CreateAuthTokenForUser(newUser.id)

      return res.status(201).json({
        registrationNumber: newUser.registrationNumber,
        authToken,
        backupData: returnedBackupData,
      });
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
