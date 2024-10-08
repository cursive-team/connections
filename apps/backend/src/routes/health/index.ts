import express, {Request, Response} from "express";
import {ErrorResponse} from "@types";
import {z} from "zod";
import {Controller} from "@/lib/controller";

export const HealthResponse = z.object({
  backend: z.boolean(),
  db: z.boolean(),
});

export type HealthResponse = z.infer<
  typeof HealthResponse
>;

const controller = new Controller();
const router = express.Router();

router.get(
  "/",
  async (
    req: Request<{}, {}, null>,
    res: Response<HealthResponse | ErrorResponse>
  ) => {

    return res.status(200).json({
      backend: true,
      db: await controller.PostgresHealthCheck(),
    });
  }
);

export default router;