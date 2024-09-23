import express, { Request, Response } from "express";
import prisma from "../lib/prisma/client";

const router = express.Router();

interface UserRegisterRequest {
  email: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
}

interface UserRegisterResponse {
  id: string;
  registrationNumber: number;
  email: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
  createdAt: Date;
}

/**
 * @route POST /api/user/register
 * @desc Registers a new user with the provided email and public keys.
 */
router.post(
  "/register",
  async (
    req: Request<{}, {}, UserRegisterRequest>,
    res: Response<UserRegisterResponse | { error: string }>
  ) => {
    const { email, signaturePublicKey, encryptionPublicKey } = req.body;

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

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          email,
          signaturePublicKey,
          encryptionPublicKey,
        },
      });

      // Send the newly created user data as a response
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  }
);

export default router;
