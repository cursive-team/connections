import {
  AccessToken,
  ErrorResponse,
  errorToString,
  OAuthExchangeTokensRequestSchema,
} from "@types";
import express, {Request, Response} from "express";
import {Controller} from "@/lib/controller";

const router = express.Router();
const controller = new Controller();

router.get(
  "/access_token",
  async (
    req: Request<{}, {}, null>,
    res: Response<AccessToken | ErrorResponse>
  ) => {
    try {
      const validatedData = OAuthExchangeTokensRequestSchema.parse(req.query);
      const { code, state } = validatedData;

      const accessToken = await controller.MintOAuthToken(state, code);
      if (!accessToken) {
        throw new Error("OAuth access token is null")
      }

      return res.status(200).json(accessToken);
    } catch (error) {
      console.error("Error in oauth/exchange_token route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router