import { AccessTokenSchema } from "@types";
import { z } from "zod";

export const OAuthDataSchema = z.object({
  app: z.string(), // TODO ImportDataType?
  token: AccessTokenSchema,
});

export type OAuthData = z.infer<typeof OAuthDataSchema>;

export const OAuthAppSchema = z.object({
  app: z.string(),
});

export type OAuthApp = z.infer<typeof OAuthAppSchema>;
