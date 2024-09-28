import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";
import {
  ErrorResponse,
  TapParams,
  TapParamsSchema,
  ChipTapResponse,
  errorToString,
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/chip/tap
 * @desc Records a chip tap and returns the tap information
 */
router.post(
  "/tap",
  async (
    req: Request<{}, {}, TapParams>,
    res: Response<ChipTapResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = TapParamsSchema.parse(req.body);

      const tapResult = await controller.GetTapFromChip(validatedData);

      if (!tapResult) {
        return res.status(404).json({
          error: "Chip not found or tap could not be processed.",
        });
      }

      return res.status(200).json(tapResult);
    } catch (error) {
      console.error("Chip tap error:", error);
      return res.status(400).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
