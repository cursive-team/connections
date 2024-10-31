import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/enclave/hash_with_secret
 * @desc Hash data with secret key
 */
router.post(
  "/hash_with_secret",
  async (
    req: Request<{}, {}, { encryptedInput: string }>,
    res: Response<
      { inputWithSecretHash: string; secretHash: string } | ErrorResponse
    >
  ) => {
    try {
      const { encryptedInput } = req.body;

      if (!encryptedInput) {
        return res.status(400).json({ error: "Encrypted data is required" });
      }

      const result = await controller.HashWithSecret(encryptedInput);

      return res.status(200).json({
        inputWithSecretHash: result.inputWithSecretHash,
        secretHash: result.secretHash,
      });
    } catch (error) {
      console.error("Error decrypting data:", error);
      return res.status(500).json({ error: errorToString(error) });
    }
  }
);

export default router;
