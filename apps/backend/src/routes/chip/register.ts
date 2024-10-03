import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";
import {
  ErrorResponse,
  RegisterChipRequest,
  RegisterChipRequestSchema,
  RegisterChipResponse,
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/chip/register
 * @desc Registers a new chip with the provided information
 */
router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterChipRequest>,
    res: Response<RegisterChipResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = RegisterChipRequestSchema.parse(req.body);

      const user = await controller.GetUserByAuthToken(validatedData.authToken);
      if (!user) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }

      // Check if the owner's public keys match the user's keys
      if (
        validatedData.ownerSignaturePublicKey &&
        validatedData.ownerSignaturePublicKey !== user.signaturePublicKey
      ) {
        return res.status(400).json({
          error: "Submitted signature public key does not match user's key",
        });
      }

      if (
        validatedData.ownerEncryptionPublicKey &&
        validatedData.ownerEncryptionPublicKey !== user.encryptionPublicKey
      ) {
        return res.status(400).json({
          error: "Submitted encryption public key does not match user's key",
        });
      }

      const newChip = await controller.RegisterChip(validatedData);

      if (
        !newChip.chipPublicKey ||
        !newChip.chipPrivateKey ||
        !newChip.chipRegisteredAt
      ) {
        throw new Error("Failed to generate chip keys");
      }

      return res.status(201).json({
        chipIssuer: newChip.chipIssuer,
        chipId: newChip.chipId,
        chipVariant: newChip.chipVariant,
        chipPublicKey: newChip.chipPublicKey,
        chipPrivateKey: newChip.chipPrivateKey,
        chipRegisteredAt: newChip.chipRegisteredAt,
      });
    } catch (error) {
      console.error("Chip registration error:", error);
      return res.status(400).json({
        error:
          "Failed to register chip. Please check your input and try again.",
      });
    }
  }
);

export default router;
