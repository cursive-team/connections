import express, { Request, Response } from "express";
import prisma from "../../lib/prisma/client";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
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
    const {
      email,
      signaturePublicKey,
      encryptionPublicKey,
      passwordSalt,
      passwordHash,
    } = req.body;

    try {
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
      console.error("Error registering user: ", error);
      return res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  }
);

export default router;
