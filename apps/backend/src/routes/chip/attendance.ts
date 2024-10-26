import express, {Request, Response} from "express";
import {Controller} from "@/lib/controller";
import {
  ChipAttendanceRequest,
  ErrorResponse,
  ChipAttendanceRequestSchema
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/chip/:id/attendance
 * @desc Get attendance weeks of chip
 */
router.get(
  "/:id/attendance",
  async (
    req: Request<{}, {}, ChipAttendanceRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    const validatedData = ChipAttendanceRequestSchema.parse(req.query);
    const { authToken } = validatedData;

    // Fetch user by auth token
    // While the user isn't specifically required, it ensures the request is from an authenticated user
    const user = await controller.GetUserByAuthToken(authToken);

    if (!user) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    // TODO: better way to get params?
    const params: Record<string, any> = req.params;
    const id: string = params["id"];
    if (!id) {
      return res.status(400).json({
        error: "Missing valid id",
      });
    }

    try {
      const weeks = await controller.GetChipAttendance(id);
      if (!weeks) {
        // Valid to not have any row
        return res.status(200).json({});
      }

      return res.status(200).json({weeks});
    } catch (error) {
      console.error("Get chip attendance error:", error);
      return res.status(400).json({
        error: "Failed to get chip attendance",
      });
    }
    return res.status(200).json({});
  }
);

export default router;