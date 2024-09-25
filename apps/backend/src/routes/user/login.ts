import express, { Request, Response } from "express";
import prisma from "@/lib/prisma/client";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token?: string;
}

const router = express.Router();

/**
 * @route POST /login
 * @desc Logs in a user with the provided email and password.
 */
router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response<AuthResponse | { error: string }>
  ) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Add your password verification logic here (e.g., bcrypt)
      // Assuming passwords match:

      // Simulate token generation
      const token = "some-jwt-token";

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  }
);

export default router;
