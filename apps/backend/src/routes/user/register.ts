import express, { Request, Response } from "express";
import prisma from "../../lib/prisma/client";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserRegisterRequestSchema,
  errorToString,
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
      // Validate request body with Zod
      const validatedData = UserRegisterRequestSchema.parse(req.body);

      const {
        email,
        signaturePublicKey,
        encryptionPublicKey,
        passwordSalt,
        passwordHash,
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

      return res
        .status(201)
        .json({ registrationNumber: newUser.registrationNumber });
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
