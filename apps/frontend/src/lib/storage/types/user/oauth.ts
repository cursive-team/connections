import {
  AccessTokenSchema,
  DataImportSource,
  DataImportSourceSchema,
  ImportDataType,
} from "@types";
import { z } from "zod";

export const OAuthDataSchema = z.object({
  app: DataImportSourceSchema,
  token: AccessTokenSchema,
});

export type OAuthData = z.infer<typeof OAuthDataSchema>;

export const OAuthAppSchema = z.object({
  app: z.coerce.string().transform((val) => {
    // Context: For a multi hour period the DELETE_OAUTH backup type used the `data_options.type` rather than the app value. At the time we didn't check the type thoroughly. This transformation converts any of the `data_options.type` values to their associated app.
    switch (val) {
      case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
        return DataImportSource.STRAVA;
      case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
        return DataImportSource.GITHUB
      case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
        return DataImportSource.GITHUB
      case ImportDataType.GITHUB_STARRED_REPOS:
        return DataImportSource.GITHUB
      case ImportDataType.GITHUB_PROGRAMMING_LANGUAGES:
        return DataImportSource.GITHUB
      default:
    }
    return DataImportSourceSchema.parse(val);
  })
});

export type OAuthApp = z.infer<typeof OAuthAppSchema>;
