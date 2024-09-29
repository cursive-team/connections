import express, { Request, Response } from "express";
import {
  ErrorResponse,
  AppendBackupDataRequest,
  AppendBackupDataResponse,
  AppendBackupDataRequestSchema,
  errorToString,
} from "@types";
import { Controller } from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/user/backup
 * @desc Allows a user to submit backup updates
 */
router.post(
  "/backup",
  async (
    req: Request<{}, {}, AppendBackupDataRequest>,
    res: Response<AppendBackupDataResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = AppendBackupDataRequestSchema.parse(req.body);
      const { authToken, newBackupData, previousSubmittedAt } = validatedData;

      // Get user from auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      // Get backup data after previous submitted at
      const rawUnprocessedBackupData = await controller.GetBackupDataAfter(
        user.id,
        previousSubmittedAt
      );
      const unprocessedBackupData = rawUnprocessedBackupData.map((backup) => ({
        authenticationTag: backup.authenticationTag,
        iv: backup.iv,
        encryptedData: backup.encryptedData,
        backupEntryType: backup.backupEntryType,
        clientCreatedAt: backup.clientCreatedAt,
        submittedAt: backup.submittedAt,
      }));

      // Append backup data for user
<<<<<<< HEAD
      const newlyAppendedBackupData = await controller.AppendBackupData(
=======
      const submittedAt = await controller.AppendBackupData(
>>>>>>> 3229d1d (backend handler for updating backup data)
        user.id,
        newBackupData
      );

<<<<<<< HEAD
      return res.status(200).json({
        success: true,
        unprocessedBackupData,
        newBackupData: newlyAppendedBackupData,
      });
=======
      return res
        .status(200)
        .json({ success: true, submittedAt, unprocessedBackupData });
>>>>>>> 3229d1d (backend handler for updating backup data)
    } catch (error) {
      console.error("Error in backup route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
