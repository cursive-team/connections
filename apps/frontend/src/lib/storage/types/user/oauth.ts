import { AccessTokenSchema, DataImportSourceSchema } from "@types";
import { z } from "zod";

export const OAuthDataSchema = z.object({
  app: DataImportSourceSchema,
  token: AccessTokenSchema,
});

export type OAuthData = z.infer<typeof OAuthDataSchema>;

export const OAuthAppSchema = z.object({
  app: DataImportSourceSchema,
});

export type OAuthApp = z.infer<typeof OAuthAppSchema>;
