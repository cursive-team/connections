import express, { Request, Response } from "express";
import {
  CreateDataHashRequest,
  CreateDataHashRequestSchema,
  ErrorResponse,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/data_hash/create
 * @desc Creates data hashes for the provided inputs
 */
router.post(
  "/create",
  async (
    req: Request<{}, {}, CreateDataHashRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = CreateDataHashRequestSchema.parse(req.body);

      const {
        authToken,
        chipIssuer,
        locationId,
        enclavePublicKey,
        dataHashInputs,
      } = validatedData;

      // Verify auth token
      const user = await controller.GetUserByAuthToken(authToken);
      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Create data hashes
      await controller.CreatePrivateDataHashes(
        dataHashInputs.map((input) => ({
          username: user.username,
          chipIssuer,
          locationId,
          dataIdentifier: input.dataIdentifier,
          encryptedInput: input.encryptedInput,
          enclavePublicKey,
        }))
      );

      return res.status(201).json({});
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;
