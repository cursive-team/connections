import express, { Request, Response } from "express";
import prisma from "@/lib/prisma/client";
import { generateAuthToken } from "@/lib/auth/token";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserRegisterRequestSchema,
  errorToString,
  BackupData,
} from "@types";

const router = express.Router();

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
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          signaturePublicKey,
          encryptionPublicKey,
          passwordSalt,
          passwordHash,
        },
      });

      const backup = await prisma.backup.create({
        data: {
          user: { connect: { id: newUser.id } },
          authenticationTag,
          iv,
          encryptedData,
          backupEntryType,
          clientCreatedAt,
        },
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
      const authToken = await generateAuthToken(newUser.id);

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
