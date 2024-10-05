import express, {Request, Response} from "express";
import {ErrorResponse} from "@types";
import {z} from "zod";

export const HealthResponse = z.object({
  status: z.string(),
});

export type HealthResponse = z.infer<
  typeof HealthResponse
>;

const router = express.Router();

router.get(
  "/status",
  async (
    req: Request<{}, {}, null>,
    res: Response<HealthResponse | ErrorResponse>
  ) => {
    return res.status(200).json({
      status: "live"
    });
  }
);

export default router;