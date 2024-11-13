import express, { Request, Response } from "express";
import { Controller } from "@/lib/controller";
import {
  ErrorResponse,
  errorToString,
  GraphEdgeResponse,
  UpsertSocialGraphEdgeRequest,
  UpsertSocialGraphEdgeRequestQuerySchema,
  UpsertSocialGraphEdgeRequestSchema,
} from "@types";

const router = express.Router();
const controller = new Controller();

/**
 * @route POST /api/graph/edge
 * @desc Upsert unidirectional graph edge after tap
 */
router.post(
  "/edge",
  async (
    req: Request<
      {},
      {},
      UpsertSocialGraphEdgeRequest
    >,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      const validatedData = UpsertSocialGraphEdgeRequestSchema.parse(req.body);
      const { id, authToken, tapSenderId, tapReceiverId } = validatedData;

      if (!authToken) {
        return res.status(400).json({ error: "Missing auth token" });
      }

      // Get user from auth token
      const user = await controller.GetUserByAuthToken(authToken);

      if (!user) {
        return res.status(401).json({ error: "Invalid auth token" });
      }

      const resp: string | ErrorResponse = await controller.UpsertGraphEdge(id, tapSenderId, tapReceiverId);
      if (typeof resp === "object") {
        throw new Error(resp.error);
      }

      return res.status(200).json({id: resp});
    } catch (error) {
      return res.status(500).json({
        error: `Error upserting graph edge: ${errorToString(error)}`,
      })
    }
  }
);

/**
 * @route GET /api/graph/edge
 * @desc Get graph edges
 */
router.get(
  "/edge",
  async (
    req: Request<
      {},
      {},
      {}
    >,
    res: Response<{} | ErrorResponse>
  ) => {
    try {
      // Allow Micah's origin
      res.header('Access-Control-Allow-Origin', 'https://micahscopes.github.io');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header("Access-Control-Allow-Headers", "*");

      const validatedData = UpsertSocialGraphEdgeRequestQuerySchema.parse(req.query);
      const { fetchUpdatedAtAfter } = validatedData;

      const resp: GraphEdgeResponse | ErrorResponse = await controller.GetGraphEdges(fetchUpdatedAtAfter);
      if ("error" in resp) {
        throw new Error(resp.error);
      }

      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json({
        error: errorToString(error),
      });
    }
  }
);

export default router;