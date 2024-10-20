import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";
import {
  ErrorResponse,
  CreateMessagesRequest,
  CreateMessagesRequestSchema,
  MessageData,
  errorToString,
  GetMessagesRequest,
  GetMessagesRequestSchema,
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route GET /api/message
 * @desc Retrieves messages for a user
 */
router.get(
  "/",
  async (
    req: Request<{}, {}, {}, GetMessagesRequest>,
    res: Response<MessageData[] | ErrorResponse>
  ) => {
    const { authToken, lastMessageFetchedAt } = GetMessagesRequestSchema.parse(
      req.query
    );

    try {
      const user = await controller.GetUserByAuthToken(authToken);
      if (!user) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }

      const messages = await controller.GetMessagesForUser(
        user.signaturePublicKey,
        lastMessageFetchedAt
      );

      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return res.status(500).json({ error: errorToString(error) });
    }
  }
);

/**
 * @route POST /api/message
 * @desc Sends a message from a user
 */
router.post(
  "/",
  async (
    req: Request<{}, {}, CreateMessagesRequest>,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const { authToken, messages } = CreateMessagesRequestSchema.parse(
        req.body
      );

      const user = await controller.GetUserByAuthToken(authToken);
      if (!user) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }

      await controller.CreateMessages(messages);

      return res.status(201).json({});
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
