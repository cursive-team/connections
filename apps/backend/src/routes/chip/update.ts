import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";
import {
  ErrorResponse,
  UpdateChipRequest,
  UpdateChipRequestSchema,
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/chip/update
 * @desc Updates a chip with the provided information
 */
router.post(
  "/update",
  async (
    req: Request<{}, {}, UpdateChipRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = UpdateChipRequestSchema.parse(req.body);

      const user = await controller.GetUserByAuthToken(validatedData.authToken);
      if (!user) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }

      await controller.UpdateChip(validatedData);

      return res.status(200).json({});
    } catch (error) {
      console.error("Chip update error:", error);
      return res.status(400).json({
        error: "Failed to update chip. Please check your input and try again.",
      });
    }
  }
);

export default router;
