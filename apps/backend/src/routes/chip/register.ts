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

      const newChip = await controller.RegisterChip(validatedData);

      if (!newChip.chipPublicKey || !newChip.chipPrivateKey) {
        throw new Error("Failed to generate chip keys");
      }

      return res.status(201).json({
        chipIssuer: newChip.chipIssuer,
        chipId: newChip.chipId,
        chipVariant: newChip.chipVariant,
        chipPublicKey: newChip.chipPublicKey,
        chipPrivateKey: newChip.chipPrivateKey,
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
