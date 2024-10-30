import express, { Request, Response } from "express";
import { ErrorResponse, errorToString } from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/data_hash/get_enclave_attestation
 * @desc Get enclave attestation document
 */
router.get(
  "/get_enclave_attestation",
  async (
    req: Request,
    res: Response<{ attestationDoc: string } | ErrorResponse>
  ) => {
    try {
      const attestationDoc = await controller.GetAttestationDoc();

      return res.status(200).json({
        attestationDoc,
      });
    } catch (error) {
      console.error("Error getting attestation document:", error);
      return res.status(500).json({ error: errorToString(error) });
    }
  }
);

export default router;
