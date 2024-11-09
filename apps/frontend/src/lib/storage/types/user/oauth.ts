import { AccessTokenSchema, DataImportSource, DataImportSourceSchema, LeaderboardEntryType } from "@types";
import { z } from "zod";

export const OAuthDataSchema = z.object({
  app: DataImportSourceSchema,
  token: AccessTokenSchema,
});

export type OAuthData = z.infer<typeof OAuthDataSchema>;

export const OAuthAppSchema = z.object({
  app: z.coerce.string().transform((val) => {
    if (val === LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE) {
      return DataImportSource.STRAVA;
    }
    return DataImportSourceSchema.parse(val);
  })
});

export type OAuthApp = z.infer<typeof OAuthAppSchema>;
