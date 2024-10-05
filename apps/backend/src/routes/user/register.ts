import express, { Request, Response } from "express";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserRegisterRequestSchema,
  errorToString,
  BackupData,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
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
        username,
        email,
        signaturePublicKey,
        encryptionPublicKey,
        psiPublicKeyLink,
        passwordSalt,
        passwordHash,
        registeredWithPasskey,
        initialBackupData,
      } = validatedData;

      const {
        authenticationTag,
        iv,
        encryptedData,
        backupEntryType,
        clientCreatedAt,
      } = initialBackupData;

      // Check if the user already exists by username (this is case insensitive)
      const existingUserByUsername =
        await controller.GetUserByUsernameCaseInsensitive(username);
      if (existingUserByUsername) {
        return res
          .status(400)
          .json({ error: "User with this username already exists" });
      }

      // Check if the user already exists by email
      const existingUserByEmail = await controller.GetUserByEmail(email);
      if (existingUserByEmail) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const newUser = await controller.CreateUser({
        username,
        email,
        signaturePublicKey,
        encryptionPublicKey,
        psiPublicKeyLink,
        passwordSalt,
        passwordHash,
        registeredWithPasskey,
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
      const authToken = await controller.CreateAuthTokenForUser(newUser.id);

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
