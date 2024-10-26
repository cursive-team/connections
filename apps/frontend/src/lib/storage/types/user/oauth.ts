import { AccessTokenSchema } from "@types";
import { z } from "zod";

export const OAuthDataSchema = z.object({
  app: z.string(),
  token: AccessTokenSchema,
});

export type OAuthData = z.infer<typeof OAuthDataSchema>;
